#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PID_DIR="${ROOT_DIR}/.run/pids"

log() {
  printf '[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$*"
}

stop_pid() {
  local name="$1"
  local pid="$2"

  if [[ -z "${pid}" ]]; then
    return 1
  fi

  if kill -0 "${pid}" >/dev/null 2>&1; then
    kill "${pid}" >/dev/null 2>&1 || true
    sleep 2
    if kill -0 "${pid}" >/dev/null 2>&1; then
      kill -9 "${pid}" >/dev/null 2>&1 || true
    fi
    log "${name} 已停止"
    return 0
  fi

  return 1
}

stop_by_port() {
  local name="$1"
  local port="$2"
  local pid
  pid="$(lsof -tiTCP:"${port}" -sTCP:LISTEN | head -n 1 || true)"
  if stop_pid "${name}" "${pid}"; then
    return 0
  fi
  log "${name} 在端口 ${port} 上未发现运行中进程"
  return 0
}

stop_pid_file() {
  local name="$1"
  local pid_file="${PID_DIR}/${name}.pid"

  if [[ ! -f "${pid_file}" ]]; then
    log "${name} 没有 PID 文件，跳过"
    return 0
  fi

  local pid
  pid="$(cat "${pid_file}")"
  if [[ -z "${pid}" ]]; then
    rm -f "${pid_file}"
    log "${name} PID 为空，已清理"
    return 0
  fi

  if ! stop_pid "${name}" "${pid}"; then
    log "${name} 进程不存在，仅清理 PID 文件"
  fi

  rm -f "${pid_file}"
}

main() {
  if [[ ! -d "${PID_DIR}" ]]; then
    log "没有找到 PID 目录，跳过"
    exit 0
  fi

  stop_pid_file "fresh-gateway"
  stop_pid_file "statistics-server"
  stop_pid_file "trade-server"
  stop_pid_file "promotion-server"
  stop_pid_file "product-server"
  stop_pid_file "wms-server"
  stop_pid_file "pay-server"
  stop_pid_file "member-server"
  stop_pid_file "infra-server"
  stop_pid_file "system-server"
  stop_pid_file "nacos"

  stop_by_port "fresh-gateway" "48080"
  stop_by_port "statistics-server" "48103"
  stop_by_port "trade-server" "48102"
  stop_by_port "promotion-server" "48101"
  stop_by_port "product-server" "48100"
  stop_by_port "wms-server" "48092"
  stop_by_port "pay-server" "48085"
  stop_by_port "member-server" "48087"
  stop_by_port "infra-server" "48082"
  stop_by_port "system-server" "48081"
  stop_by_port "nacos" "8848"
}

main "$@"
