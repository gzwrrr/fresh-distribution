# Fresh Distribution 可观测性说明

## 1. 当前已经落地了什么

这套仓库现在已经补齐了一套可直接启动的本地观测栈：

- `Spring Boot Actuator`
- `Micrometer Prometheus Registry`
- `Prometheus`
- `Grafana`

整体关系可以先这样理解：

1. 每个微服务通过 `/actuator/prometheus` 暴露指标
2. `Prometheus` 定时抓取这些指标
3. `Grafana` 读取 Prometheus 数据并展示面板

## 2. 默认监控范围

当前默认抓取以下服务：

- `fresh-gateway`
- `system-server`
- `infra-server`
- `pay-server`
- `member-server`
- `wms-server`
- `product-server`
- `promotion-server`
- `trade-server`
- `statistics-server`

## 3. 启动方式

先启动后端分布式服务：

```bash
cd /Users/zhiwengong/code/code/Java/Team/distribution/fresh-distribution
bash script/local/start-distributed.sh
```

再启动观测栈：

```bash
bash script/local/start-observability.sh
```

停止观测栈：

```bash
bash script/local/stop-observability.sh
```

## 4. 访问地址

- Prometheus: `http://127.0.0.1:19090`
- Grafana: `http://127.0.0.1:13000`
- Grafana 默认账号: `admin`
- Grafana 默认密码: `admin123`

## 5. 验证方法

### 先验证服务指标端点

至少确认以下地址能打开：

- `http://127.0.0.1:48080/actuator/prometheus`
- `http://127.0.0.1:48082/actuator/prometheus`
- `http://127.0.0.1:48092/actuator/prometheus`

如果返回文本指标，说明服务端已经具备 Prometheus 抓取能力。

### 再验证 Prometheus 抓取状态

打开：

- `http://127.0.0.1:19090/targets`

正常情况下，目标状态应为 `UP`。

### 最后验证 Grafana 面板

Grafana 启动后会自动预置：

- 数据源：`Prometheus`
- 面板：`Fresh Distribution Overview`

默认面板包含：

- 在线服务数
- 服务可用率
- 服务存活状态
- JVM 堆内存
- 进程 CPU 使用率
- 接口吞吐量
- 平均响应耗时
- JVM 活跃线程数

## 6. 仓库中的相关文件

- `script/observability/docker-compose.yml`
- `script/observability/prometheus/prometheus.yml`
- `script/observability/grafana/provisioning/datasources/datasource.yml`
- `script/observability/grafana/provisioning/dashboards/dashboard.yml`
- `script/observability/grafana/dashboards/fresh-distribution-overview.json`
- `script/local/start-observability.sh`
- `script/local/stop-observability.sh`
- `docs/runbook/grafana-dashboard-templates.md`

## 7. 当前边界

现在已经有 Prometheus/Grafana 的本地观测能力，但还不是完整生产级方案。

当前还没有默认落地的是：

- Alertmanager 告警
- SkyWalking / OTel Collector 后端
- Loki / ELK 集中式日志平台
- 监控数据高可用存储

如果后面要继续补稳定性，建议优先顺序是：

1. Prometheus 告警规则 + Alertmanager
2. Grafana 告警通知
3. SkyWalking 或 OTel 全链路
4. Loki 或 ELK 日志平台
