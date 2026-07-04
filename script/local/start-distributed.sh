#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
RUN_DIR="${ROOT_DIR}/.run"
LOG_DIR="${RUN_DIR}/logs"
PID_DIR="${RUN_DIR}/pids"

DEFAULT_NACOS_HOME=""
for candidate in \
  "/Users/zhiwengong/data/data/Server/环境/Nacos/runtime/nacos-2.2.3/nacos" \
  "/Users/zhiwengong/data/data/Server/环境/Nacos/runtime/nacos"; do
  if [[ -x "${candidate}/bin/startup.sh" ]]; then
    DEFAULT_NACOS_HOME="${candidate}"
    break
  fi
done
NACOS_HOME="${NACOS_HOME:-$DEFAULT_NACOS_HOME}"
NACOS_HOST="${NACOS_HOST:-127.0.0.1}"
NACOS_PORT="${NACOS_PORT:-8848}"
NACOS_GRPC_PORT="${NACOS_GRPC_PORT:-9848}"
NACOS_NAMESPACE="${NACOS_NAMESPACE:-dev}"

MYSQL_USER="${MYSQL_USER:-root}"
MYSQL_PASSWORD="${MYSQL_PASSWORD:-}"

JAVA_OPTS_DEFAULT="-Xms256m -Xmx768m"
JAVA_OPTS="${JAVA_OPTS:-$JAVA_OPTS_DEFAULT}"

mkdir -p "${LOG_DIR}" "${PID_DIR}"

log() {
  printf '[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$*"
}

wait_for_port() {
  local port="$1"
  local retries="${2:-180}"
  local i
  for ((i = 1; i <= retries; i++)); do
    if lsof -nP -iTCP:"${port}" -sTCP:LISTEN >/dev/null 2>&1; then
      return 0
    fi
    sleep 1
  done
  return 1
}

wait_for_http() {
  local url="$1"
  local retries="${2:-180}"
  local i
  for ((i = 1; i <= retries; i++)); do
    if curl -fsS "${url}" >/dev/null 2>&1; then
      return 0
    fi
    sleep 1
  done
  return 1
}

cleanup_stale_pid() {
  local pid_file="$1"
  if [[ -f "${pid_file}" ]]; then
    local pid
    pid="$(cat "${pid_file}")"
    if [[ -n "${pid}" ]] && kill -0 "${pid}" >/dev/null 2>&1; then
      return 0
    fi
    rm -f "${pid_file}"
  fi
  return 1
}

ensure_dev_namespace() {
  local namespace_payload
  namespace_payload="$(curl -fsS "http://${NACOS_HOST}:${NACOS_PORT}/nacos/v1/console/namespaces" || true)"
  if grep -q "\"namespace\":\"${NACOS_NAMESPACE}\"" <<<"${namespace_payload}"; then
    log "Nacos namespace ${NACOS_NAMESPACE} 已存在"
    return 0
  fi

  curl -fsS -X POST "http://${NACOS_HOST}:${NACOS_PORT}/nacos/v1/console/namespaces" \
    --data-urlencode "customNamespaceId=${NACOS_NAMESPACE}" \
    --data-urlencode "namespaceName=${NACOS_NAMESPACE}" \
    --data-urlencode "namespaceDesc=local ${NACOS_NAMESPACE}" >/dev/null
  log "已创建 Nacos namespace ${NACOS_NAMESPACE}"
}

start_nacos() {
  local nacos_pid_file="${PID_DIR}/nacos.pid"
  if lsof -nP -iTCP:"${NACOS_PORT}" -sTCP:LISTEN >/dev/null 2>&1; then
    log "Nacos 已在 ${NACOS_HOST}:${NACOS_PORT} 运行"
    local running_pid
    running_pid="$(lsof -tiTCP:"${NACOS_PORT}" -sTCP:LISTEN | head -n 1 || true)"
    if [[ -n "${running_pid}" ]]; then
      printf '%s\n' "${running_pid}" > "${nacos_pid_file}"
    fi
    return 0
  fi

  if [[ ! -x "${NACOS_HOME}/bin/startup.sh" ]]; then
    log "Nacos 启动脚本不存在: ${NACOS_HOME}/bin/startup.sh"
    return 1
  fi

  log "启动 Nacos..."
  nohup bash "${NACOS_HOME}/bin/startup.sh" -m standalone > "${LOG_DIR}/nacos-console.log" 2>&1 &

  if ! wait_for_http "http://${NACOS_HOST}:${NACOS_PORT}/nacos/" 180; then
    log "Nacos 启动失败，请检查 ${LOG_DIR}/nacos-console.log"
    return 1
  fi

  if ! wait_for_port "${NACOS_GRPC_PORT}" 180; then
    log "Nacos HTTP 已启动，但 gRPC 端口 ${NACOS_GRPC_PORT} 未就绪，请检查 ${LOG_DIR}/nacos-console.log"
    return 1
  fi

  local running_pid
  running_pid="$(lsof -tiTCP:"${NACOS_PORT}" -sTCP:LISTEN | head -n 1 || true)"
  if [[ -n "${running_pid}" ]]; then
    printf '%s\n' "${running_pid}" > "${nacos_pid_file}"
  fi
  log "Nacos 启动成功"
}

start_java_service() {
  local display_name="$1"
  local jar_rel="$2"
  local service_name="$3"
  local port="$4"

  local pid_file="${PID_DIR}/${display_name}.pid"
  local log_file="${LOG_DIR}/${display_name}.log"
  local jar_path="${ROOT_DIR}/${jar_rel}"

  if cleanup_stale_pid "${pid_file}"; then
    log "${display_name} 已在运行"
    return 0
  fi

  if lsof -nP -iTCP:"${port}" -sTCP:LISTEN >/dev/null 2>&1; then
    log "端口 ${port} 已被占用，跳过 ${display_name}"
    return 1
  fi

  if [[ "${jar_rel}" == *.jar ]]; then
    local exec_jar_path="${ROOT_DIR}/${jar_rel%.jar}-exec.jar"
    if [[ -f "${exec_jar_path}" ]]; then
      jar_path="${exec_jar_path}"
    fi
  fi

  if [[ ! -f "${jar_path}" ]]; then
    log "缺少启动包: ${jar_path}"
    return 1
  fi

  log "启动 ${display_name} (${service_name})..."
  nohup java ${JAVA_OPTS} -jar "${jar_path}" \
    --spring.profiles.active=local \
    --spring.cloud.nacos.discovery.service="${service_name}" \
    --spring.datasource.dynamic.datasource.master.username="${MYSQL_USER}" \
    --spring.datasource.dynamic.datasource.master.password="${MYSQL_PASSWORD}" \
    --spring.datasource.dynamic.datasource.slave.username="${MYSQL_USER}" \
    --spring.datasource.dynamic.datasource.slave.password="${MYSQL_PASSWORD}" \
    > "${log_file}" 2>&1 &

  local pid=$!
  printf '%s\n' "${pid}" > "${pid_file}"

  if ! wait_for_port "${port}" 240; then
    log "${display_name} 未能在预期时间内监听 ${port}，请检查 ${log_file}"
    return 1
  fi

  log "${display_name} 已监听 127.0.0.1:${port}"
}

main() {
  cd "${ROOT_DIR}"

  start_nacos
  ensure_dev_namespace

  start_java_service "system-server" "fresh-module-system/fresh-module-system-server/target/fresh-module-system-server.jar" "system-server" "48081"
  start_java_service "infra-server" "fresh-module-infra/fresh-module-infra-server/target/fresh-module-infra-server.jar" "infra-server" "48082"
  start_java_service "member-server" "fresh-module-member/fresh-module-member-server/target/fresh-module-member-server.jar" "member-server" "48087"
  start_java_service "pay-server" "fresh-module-pay/fresh-module-pay-server/target/fresh-module-pay-server.jar" "pay-server" "48085"
  start_java_service "wms-server" "fresh-module-wms/fresh-module-wms-server/target/fresh-module-wms-server.jar" "wms-server" "48092"
  start_java_service "product-server" "fresh-module-mall/fresh-module-product-server/target/fresh-module-product-server.jar" "product-server" "48100"
  start_java_service "promotion-server" "fresh-module-mall/fresh-module-promotion-server/target/fresh-module-promotion-server.jar" "promotion-server" "48101"
  start_java_service "trade-server" "fresh-module-mall/fresh-module-trade-server/target/fresh-module-trade-server.jar" "trade-server" "48102"
  start_java_service "statistics-server" "fresh-module-mall/fresh-module-statistics-server/target/fresh-module-statistics-server.jar" "statistics-server" "48103"
  start_java_service "fresh-gateway" "fresh-gateway/target/fresh-gateway.jar" "fresh-gateway" "48080"

  log "分布式服务启动完成"
  log "网关地址: http://127.0.0.1:48080"
  log "Nacos 地址: http://127.0.0.1:8848/nacos"
  log "Actuator 示例: http://127.0.0.1:48082/actuator/health"
  log "Prometheus 指标示例: http://127.0.0.1:48082/actuator/prometheus"
}

main "$@"
