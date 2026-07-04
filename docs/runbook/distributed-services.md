# Fresh Distribution 分布式服务总览

## 1. 这份文档解决什么问题

这套工程同时保留了：

- 单体聚合启动方式：`fresh-server`
- 分布式微服务启动方式：多个 `fresh-*-server` + `fresh-gateway`

当前生鲜项目建议使用分布式方式启动，原因很直接：

- 更贴近后续真实部署形态
- 每个业务服务可以独立排查、重启和扩容
- 注册中心、网关、监控链路都能尽早按微服务思路收口

本文只关注分布式模式，不再使用单体 `fresh-server`。

## 2. 分布式服务清单

| 服务 | 模块目录 | 默认端口 | Nacos 注册名 | 主要职责 |
| --- | --- | ---: | --- | --- |
| 网关 | `fresh-gateway` | `48080` | `fresh-gateway` | 统一入口、路由、跨域、访问日志、鉴权前置过滤 |
| 系统服务 | `fresh-module-system/fresh-module-system-server` | `48081` | `system-server` | 用户、角色、菜单、租户、短信、字典、认证能力 |
| 基础设施服务 | `fresh-module-infra/fresh-module-infra-server` | `48082` | `infra-server` | 文件、代码生成、定时任务、访问日志、错误日志、监控后台 |
| 支付服务 | `fresh-module-pay/fresh-module-pay-server` | `48085` | `pay-server` | 支付单、退款单、支付回调 |
| 会员服务 | `fresh-module-member/fresh-module-member-server` | `48087` | `member-server` | 会员、收货地址、用户侧资料 |
| WMS 服务 | `fresh-module-wms/fresh-module-wms-server` | `48092` | `wms-server` | 仓库、库存、出入库、生鲜库存基础能力 |
| 商品服务 | `fresh-module-mall/fresh-module-product-server` | `48100` | `product-server` | SPU/SKU、分类、属性、商品管理 |
| 营销服务 | `fresh-module-mall/fresh-module-promotion-server` | `48101` | `promotion-server` | 优惠券、活动、营销规则 |
| 交易服务 | `fresh-module-mall/fresh-module-trade-server` | `48102` | `trade-server` | 购物车、订单、售后、交易流程 |
| 统计服务 | `fresh-module-mall/fresh-module-statistics-server` | `48103` | `statistics-server` | 商城统计、经营分析相关接口 |

说明：

- `fresh-server` 虽然仍在仓库中，但本次不参与启动。
- 当前工程里的 Spring 应用名大多带 `fresh-` 前缀，但网关路由和 RPC 常量依赖的注册名是 `system-server`、`infra-server` 这类短名，所以分布式启动时需要显式覆盖 Nacos 注册名。

## 3. 启动前置条件

### 必需依赖

| 依赖 | 默认地址 | 用途 |
| --- | --- | --- |
| MySQL | `127.0.0.1:3306` | 默认业务库（当前库名兼容沿用） |
| Redis | `127.0.0.1:6379` | 缓存、分布式锁、部分状态共享 |
| Nacos | `127.0.0.1:8848/nacos` | 配置中心、服务注册与发现 |

### 当前本地约定

- MySQL 用户：`root`
- MySQL 密码：空密码
- 业务数据库：当前默认仍为 `ruoyi-vue-pro`（兼容沿用，后续可单独迁移）
- Nacos 2.2.3 推荐目录：`/Users/zhiwengong/data/data/Server/环境/Nacos/runtime/nacos-2.2.3/nacos`
- 老的 Nacos 1.4.4 目录虽然还在，但不建议再用于当前这套工程

## 4. 服务之间的关系

最常用的调用链可以先这样理解：

1. 前端请求先进入 `fresh-gateway`
2. 网关按路由转发到具体业务服务
3. `system-server` 提供登录、用户、菜单、权限等基础能力
4. `infra-server` 提供访问日志、错误日志、文件、监控后台等基础设施能力
5. `trade-server`、`product-server`、`promotion-server`、`member-server`、`pay-server`、`wms-server` 按业务场景相互调用

对生鲜项目来说，可以先把职责理解为：

- `mall` 负责商品、营销、订单、售后
- `wms` 负责仓库与库存
- `system` 负责账号权限
- `infra` 负责运维基础能力

## 5. 稳定性保障现状

这一段很重要，目的是把“已经有”和“还没真正落地”的东西分开。

### 已具备

- `Nacos`：已经作为注册中心/服务发现方案使用
- `Spring Boot Actuator`：各服务已开放 `actuator` 端点
- `Prometheus 指标端点`：各服务可通过 `/actuator/prometheus` 暴露指标
- `Spring Boot Admin Client`：各服务都带有客户端配置
- `infra-server` 内置 `Spring Boot Admin Server`：
  - 地址通常为 `http://127.0.0.1:48082/admin`
- `Prometheus + Grafana`：
  - 仓库内已补齐本地启动脚本、采集配置和默认面板
- 访问日志能力：
  - 网关侧有访问日志过滤器
  - 业务侧保留访问日志配置能力
  - `infra-server` 提供访问日志查询接口
- 错误日志能力：
  - `infra-server` 提供错误日志落库与查询能力
- 链路追踪代码预埋：
  - 工程里已经保留了 SkyWalking / OpenTelemetry 相关依赖与工具类

### 目前还没有完整落地的部分

- `SkyWalking / OTel Collector / Jaeger`
  - 代码层面有预埋
  - 但本地和当前仓库里没有默认启动整套链路追踪后端
- 集中式日志平台
  - 没有现成的 ELK / Loki / Vector / Fluent Bit 部署
- 告警平台
  - 没有现成的 Prometheus Alertmanager、企业微信/钉钉告警编排

### 现在这套工程更准确的结论

它已经具备“微服务运行骨架”和“Prometheus/Grafana 本地观测能力”，但还没有形成完整的生产级观测体系。  
如果后续要补齐生产稳定性，建议优先补这四块：

1. Nacos 高可用或至少备份方案
2. Prometheus 告警规则 + Alertmanager
3. SkyWalking 或 OpenTelemetry 全链路
4. Loki/ELK + 告警通知

## 6. 推荐启动方式

统一使用仓库脚本：

```bash
cd /Users/zhiwengong/code/code/Java/Team/distribution/fresh-distribution
bash script/local/start-distributed.sh
```

停止：

```bash
bash script/local/stop-distributed.sh
```

如需启动监控面板：

```bash
bash script/local/start-observability.sh
```

脚本特点：

- 只启动分布式服务，不启动 `fresh-server`
- 会优先拉起本地 Nacos
- 会优先选择本地的 Nacos 2.2.3 运行时
- 会自动确保 `dev` 命名空间存在
- 会为每个微服务显式指定 Nacos 注册名
- 会把日志写到仓库内的 `.run/logs/`
- 观测栈单独由 `start-observability.sh` 负责拉起

## 7. 启动后的验证点

### 端口检查

| 服务 | 访问地址 |
| --- | --- |
| Nacos | `http://127.0.0.1:8848/nacos` |
| Gateway | `http://127.0.0.1:48080` |
| System | `http://127.0.0.1:48081/` |
| Infra | `http://127.0.0.1:48082/` |
| Infra Admin | `http://127.0.0.1:48082/admin` |
| Member | `http://127.0.0.1:48087/` |
| Pay | `http://127.0.0.1:48085/` |
| WMS | `http://127.0.0.1:48092/` |
| Product | `http://127.0.0.1:48100/` |
| Promotion | `http://127.0.0.1:48101/` |
| Trade | `http://127.0.0.1:48102/` |
| Statistics | `http://127.0.0.1:48103/` |

额外建议验证：

- `http://127.0.0.1:48082/actuator/health`
- `http://127.0.0.1:48082/actuator/prometheus`
- `http://127.0.0.1:48092/actuator/prometheus`

如果还要验证监控面板：

- `http://127.0.0.1:19090/targets`
- `http://127.0.0.1:13000`

### Nacos 内应能看到的注册服务

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

## 8. 日志位置

分布式启动脚本默认写入：

```text
.run/logs/
```

常用文件：

- `.run/logs/nacos-console.log`
- `.run/logs/fresh-gateway.log`
- `.run/logs/system-server.log`
- `.run/logs/infra-server.log`
- `.run/logs/member-server.log`
- `.run/logs/pay-server.log`
- `.run/logs/wms-server.log`
- `.run/logs/product-server.log`
- `.run/logs/promotion-server.log`
- `.run/logs/trade-server.log`
- `.run/logs/statistics-server.log`

## 9. 当前已知注意点

- 本地 `application-local.yaml` 中业务库密码默认写的是 `123456`，但当前机器实际 MySQL 为 `root` 空密码，所以脚本里会在启动参数中覆盖密码。
- 网关路由依赖的服务名，与服务自身 `spring.application.name` 不完全一致，所以脚本里会统一覆盖 `spring.cloud.nacos.discovery.service`。
- 本地 Nacos `1.4.4` 与当前工程使用的 Spring Cloud Alibaba / Nacos Client 组合不兼容，微服务会在注册阶段报 `Client not connected, current status: STARTING`，因此需要切到 Nacos `2.2.3`。
- 当前没有启用 MQ、Grafana、Prometheus、SkyWalking 后端，因此“分布式启动成功”不等于“生产级可观测性已经完备”。
