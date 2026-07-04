# Fresh Distribution Grafana 模板清单

## 1. 这份文档解决什么问题

这份清单只做一件事：

- 按当前 `fresh-distribution` 已经暴露出来的 Prometheus 指标
- 筛出现在就能在 Grafana 里直接导入使用的模板
- 同时标出哪些模板还需要补 exporter 或补指标后才能用

这样你后续做面板时，不会把时间浪费在“能导入但跑不起来”的模板上。

## 2. 当前服务与指标现状

### 当前被 Prometheus 抓取的服务

- `fresh-gateway`
- `system-server`
- `infra-server`
- `member-server`
- `pay-server`
- `wms-server`
- `product-server`
- `promotion-server`
- `trade-server`
- `statistics-server`

### 当前确认已经存在的指标类型

- `jvm_*`
- `process_*`
- `system_*`
- `http_server_requests_*`
- `executor_*`
- `tomcat_sessions_*`
- `logback_events_total`

### 当前确认还没有的指标类型

- `hikaricp_*`
- `redis_*`
- `nacos_*`

这意味着：

- JVM / 进程 / 系统 / HTTP 相关模板现在就能用
- HikariCP / JDBC 模板当前不能直接用
- Redis 模板当前不能直接用
- Nacos 模板当前不能直接用

## 3. 当前最推荐的“全服务覆盖”组合

如果目标是先把全服务都覆盖起来，建议按下面这一组来导：

1. 仓库内置面板：`Fresh Distribution Overview`
2. Grafana 社区模板：`4701 - JVM (Micrometer)`
3. Grafana 社区模板：`12464 - Spring Boot Statistics`
4. 如果还想看接口粒度，再补：`14430 - Spring Boot Statistics & Endpoint Metrics`

推荐理由：

- `Fresh Distribution Overview` 适合看“整体服务是否健康”
- `4701` 适合统一看 10 个服务的 JVM、CPU、线程、GC
- `12464` 适合看 9 个 Spring MVC / Tomcat 业务服务的 HTTP、Session、应用层指标
- `14430` 适合继续往接口访问量、慢接口方向看

## 4. 可直接使用的模板

### 4.1 仓库内置：Fresh Distribution Overview

- 类型：仓库内置 JSON
- 位置：`script/observability/grafana/dashboards/fresh-distribution-overview.json`
- 当前状态：已自动预置
- 适用服务：全服务

适合看：

- 在线服务数
- 服务可用率
- 各服务 JVM 堆内存
- 各服务 CPU
- 各服务吞吐量
- 各服务平均响应耗时

这块是你当前最适合当首页总览的面板。

### 4.2 4701 - JVM (Micrometer)

- Dashboard ID：`4701`
- 链接：[JVM (Micrometer)](https://grafana.com/grafana/dashboards/4701-jvm-micrometer/)
- 当前状态：可直接使用
- 适用服务：全服务

为什么适合当前项目：

- Grafana 页面明确说明它适用于 `Micrometer` 指标
- 页面明确说明它依赖一个公共标签 `application`
- 当前项目已经通过 `MeterRegistryCustomizer` 给所有指标打上了 `application=${spring.application.name}`

当前最适合覆盖的服务：

- `fresh-gateway`
- `fresh-system-server`
- `fresh-infra-server`
- `fresh-member-server`
- `fresh-pay-server`
- `fresh-wms-server`
- `fresh-product-server`
- `fresh-promotion-server`
- `fresh-trade-server`
- `fresh-statistics-server`

重点价值：

- 它是当前唯一一个“天然适合 10 个服务一起横向对比”的现成社区模板
- 对 `fresh-gateway` 也友好，因为它重点依赖 JVM / process / system / HTTP 指标，不强依赖 Tomcat Session

### 4.3 12464 - Spring Boot Statistics

- Dashboard ID：`12464`
- 链接：[Spring Boot Statistics](https://grafana.com/grafana/dashboards/12464-spring-boot-statistics/)
- 当前状态：可直接使用
- 适用服务：除网关外的 9 个业务服务最合适

Grafana 页面给出的关键信息：

- 适用于 `Spring Boot actuator` 的 `prometheus` 端点
- 使用变量：
  - `$instance`
  - `$application`
  - `$hikaricp`

结合当前项目的判断：

- `$application`：可用
- `$instance`：可用
- `$hikaricp`：当前大概率为空，因为现在 Prometheus 中没有 `hikaricp_*` 指标

所以它现在的实际效果是：

- JVM、HTTP、Session、应用层面板可用
- HikariCP 相关面板可能为空或信息不完整

最适合的服务：

- `fresh-system-server`
- `fresh-infra-server`
- `fresh-member-server`
- `fresh-pay-server`
- `fresh-wms-server`
- `fresh-product-server`
- `fresh-promotion-server`
- `fresh-trade-server`
- `fresh-statistics-server`

不建议把它当成 `fresh-gateway` 的主模板，因为网关是 `Netty`，不是典型 `Tomcat MVC` 服务。

### 4.4 14430 - Spring Boot Statistics & Endpoint Metrics

- Dashboard ID：`14430`
- 链接：[Spring Boot Statistics & Endpoint Metrics](https://grafana.com/grafana/dashboards/14430-spring-boot-statistics-endpoint-metrics/)
- 当前状态：可直接使用
- 适用服务：除网关外的 9 个业务服务

这个模板可以理解为：

- `12464` 的接口视角增强版

更适合什么时候导：

- 你已经有总览面板
- 你想继续看接口访问量、错误率、慢接口
- 你想重点看某个业务服务的 API 行为

如果你不想导太多模板，`12464` 和 `14430` 二选一即可。  
如果你想一个偏系统、一个偏接口，两者也可以一起保留。

## 5. 可以作为备选的模板

### 5.1 21985 - Spring Boot 2x

- Dashboard ID：`21985`
- 链接：[Spring Boot 2x](https://grafana.com/grafana/dashboards/21985-spring-boot-2x/)
- 当前状态：理论上可用，建议先小范围试用
- 适用服务：除网关外的 9 个业务服务

为什么放在备选而不是首推：

- 它比 `12464` 新
- 但当前项目已经明确验证过 `12464` 这类 Micrometer / Spring Boot 2.x 模板更贴近现状
- 如果后面你更偏好较新的面板风格，可以选它替换 `12464`

建议：

- 不要一开始同时导 `12464`、`14430`、`21985`
- 先以 `12464` 为主，`21985` 作为后续替换候选

### 5.2 10231 - Spring Boot Micrometer

- Dashboard ID：`10231`
- 链接：[Spring Boot Micrometer](https://grafana.com/grafana/dashboards/10231-spring-boot-micrometer/)
- 当前状态：可尝试
- 适用服务：大部分业务服务

为什么不是首推：

- 模板偏老
- 与 `12464`、`14430` 的能力重叠比较高
- 没必要在第一批导入时重复建设

## 6. 当前不建议直接导入的模板

### 6.1 Redis 模板

可参考模板：

- `763`：[Redis Dashboard for Prometheus Redis Exporter 1.x](https://grafana.com/grafana/dashboards/763-redis-dashboard-for-prometheus-redis-exporter-1-x/)
- `14615`：[Redis Clusters via redis_exporter 3.0](https://grafana.com/grafana/dashboards/14615-redis-clusters-via-redis-exporter-3-0/)

当前不建议直接导的原因：

- 当前 Prometheus 没有 `redis_*` 指标
- 说明 Redis Exporter 还没接进来

要启用它们，至少还需要：

1. 部署 `redis_exporter`
2. 在 Prometheus 增加 Redis 抓取任务
3. 确认 `redis_*` 指标已经出现

### 6.2 Nacos 模板

可参考模板：

- `13221`：[Nacos](https://grafana.com/grafana/dashboards/13221-nacos/)

当前不建议直接导的原因：

- 当前 Prometheus 没有 `nacos_*` 指标
- 现在抓的是业务服务，不是 Nacos 自身的 Prometheus 指标

要启用它，通常还需要：

1. 确认 Nacos 暴露 Prometheus 指标
2. 在 Prometheus 中新增 Nacos 抓取配置
3. 验证 `nacos_*` 指标是否进入时序库

### 6.3 HikariCP / JDBC 模板

可参考模板：

- `6083`：[Spring Boot HikariCP / JDBC](https://grafana.com/grafana/dashboards/6083-spring-boot-hikaricp-jdbc/)
- `20729`：[Spring Boot JDBC & HikariCP](https://grafana.com/grafana/dashboards/20729-spring-boot-jdbc-hikaricp/)

当前不建议直接导的原因：

- 当前 Prometheus 查询结果里没有 `hikaricp_*`
- 所以连接池相关图表当前不会有完整数据

要启用它们，需要先确认：

1. 应用确实把 JDBC / HikariCP 指标暴露出来
2. Prometheus 中能查到 `hikaricp_connections` 等指标

## 7. 推荐导入顺序

建议按这个顺序导入：

1. 保留仓库内置的 `Fresh Distribution Overview`
2. 导入 `4701 - JVM (Micrometer)`，先覆盖全服务
3. 导入 `12464 - Spring Boot Statistics`，补齐 9 个业务服务
4. 如果还要做接口排查，再导 `14430 - Spring Boot Statistics & Endpoint Metrics`
5. 等 Redis / Nacos / HikariCP 指标补齐后，再补对应专项模板

## 8. 按服务维度怎么覆盖

### 全服务统一覆盖

优先使用：

- `Fresh Distribution Overview`
- `4701 - JVM (Micrometer)`

覆盖服务：

- `fresh-gateway`
- `fresh-system-server`
- `fresh-infra-server`
- `fresh-member-server`
- `fresh-pay-server`
- `fresh-wms-server`
- `fresh-product-server`
- `fresh-promotion-server`
- `fresh-trade-server`
- `fresh-statistics-server`

### 业务服务深度覆盖

优先使用：

- `12464 - Spring Boot Statistics`
- 或 `14430 - Spring Boot Statistics & Endpoint Metrics`

覆盖服务：

- `fresh-system-server`
- `fresh-infra-server`
- `fresh-member-server`
- `fresh-pay-server`
- `fresh-wms-server`
- `fresh-product-server`
- `fresh-promotion-server`
- `fresh-trade-server`
- `fresh-statistics-server`

### 网关单独说明

`fresh-gateway` 当前更适合用：

- `Fresh Distribution Overview`
- `4701 - JVM (Micrometer)`

原因：

- 它是 `Spring Cloud Gateway + Netty`
- 不适合依赖 Tomcat Session 视角的模板做主看板

## 9. 当前最务实的结论

如果你现在就要快速把全服务 Grafana 面板铺起来，最务实的组合就是：

1. 继续用仓库内置总览面板
2. 导入 `4701`
3. 导入 `12464`
4. 如果需要接口维度，再导入 `14430`

这套组合已经可以覆盖当前 10 个服务的：

- 可用性
- JVM
- CPU
- 线程
- GC
- HTTP 请求
- 大部分 Spring Boot 应用运行态

但还不能覆盖：

- Redis 内部运行态
- Nacos 内部运行态
- JDBC / HikariCP 连接池

这些要等后续把对应指标补进 Prometheus 之后再扩展。
