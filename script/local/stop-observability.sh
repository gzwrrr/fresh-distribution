#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
OBSERVABILITY_DIR="${ROOT_DIR}/script/observability"
COMPOSE_FILE="${OBSERVABILITY_DIR}/docker-compose.yml"

log() {
  printf '[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$*"
}

resolve_compose_cmd() {
  if command -v docker-compose >/dev/null 2>&1; then
    echo "docker-compose"
    return 0
  fi

  if docker compose version >/dev/null 2>&1; then
    echo "docker compose"
    return 0
  fi

  log "未找到 docker-compose 或 docker compose，请先安装其中之一"
  exit 1
}

prepare_docker_config() {
  local docker_config_dir="${DOCKER_CONFIG:-$HOME/.docker}"
  local config_file="${docker_config_dir}/config.json"

  if command -v docker-credential-desktop >/dev/null 2>&1; then
    return 0
  fi

  if [[ ! -f "${config_file}" ]] || ! grep -q '"credsStore"[[:space:]]*:[[:space:]]*"desktop"' "${config_file}"; then
    return 0
  fi

  local temp_dir
  temp_dir="$(mktemp -d)"
  cp -R "${docker_config_dir}/." "${temp_dir}/"
  python3 - "${config_file}" "${temp_dir}/config.json" <<'PY'
import json
import sys

source_path, target_path = sys.argv[1], sys.argv[2]
with open(source_path, "r", encoding="utf-8") as source_file:
    config = json.load(source_file)

config.pop("credsStore", None)
config.pop("credHelpers", None)

with open(target_path, "w", encoding="utf-8") as target_file:
    json.dump(config, target_file)
PY

  export DOCKER_CONFIG="${temp_dir}"
  trap 'rm -rf "'"${temp_dir}"'"' EXIT
}

main() {
  local compose_cmd
  compose_cmd="$(resolve_compose_cmd)"
  prepare_docker_config

  cd "${OBSERVABILITY_DIR}"
  ${compose_cmd} -f "${COMPOSE_FILE}" down

  log "Prometheus / Grafana 已停止"
}

main "$@"
