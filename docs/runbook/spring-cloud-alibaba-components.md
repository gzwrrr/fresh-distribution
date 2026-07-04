# Fresh Distribution 是否使用 Spring Cloud Alibaba

## 结论

是，这个项目使用了 **Spring Cloud Alibaba**，但不是把整套 Alibaba 生态全部接入，而是以 **Nacos 配置中心 + Nacos 注册/服务发现** 为核心，配合 **Spring Cloud Gateway** 和 **OpenFeign** 来组织微服务。

更准确地说，这个仓库当前属于：

- Spring Boot
- Spring Cloud
- Spring Cloud Alibaba（实际已落地的核心是 Nacos）

而不是已经完整接入 Sentinel、Seata、Dubbo 这一整套典型 Alibaba 组件。

## 证据

### 1. BOM 明确引入了 Spring Cloud Alibaba

在 `fresh-dependencies/pom.xml` 中可以看到：

- 定义了 `spring.cloud.alibaba.version=2021.0.6.2`
- 引入了 `com.alibaba.cloud:spring-cloud-alibaba-dependencies`

这说明项目底层依赖管理明确采用了 Spring Cloud Alibaba 体系。

### 2. 多个服务显式接入了 Nacos

多个服务模块的 `pom.xml` 中都存在：

- `spring-cloud-starter-alibaba-nacos-discovery`
- `spring-cloud-starter-alibaba-nacos-config`

当前明确可见的服务包括：

- `fresh-gateway`
- `fresh-server`
- `fresh-module-system/fresh-module-system-server`
- `fresh-module-infra/fresh-module-infra-server`
- `fresh-module-member/fresh-module-member-server`
- `fresh-module-pay/fresh-module-pay-server`
- `fresh-module-wms/fresh-module-wms-server`
- `fresh-module-mall/fresh-module-product-server`
- `fresh-module-mall/fresh-module-promotion-server`
- `fresh-module-mall/fresh-module-trade-server`
- `fresh-module-mall/fresh-module-statistics-server`

### 3. 配置文件实际使用了 Nacos

从各服务的 `application.yaml` / `application-local.yaml` / `application-dev.yaml` 可以确认：

- 存在 `spring.cloud.nacos.*` 配置
- 存在从 Nacos 读取配置的导入逻辑

这说明 Nacos 不是“只引了依赖”，而是已经作为项目运行时的一部分在使用。

## 当前实际落地的 Spring Cloud Alibaba 组件

### 1. Nacos Config

用途：

- 配置中心
- 按环境管理微服务配置
- 各服务启动时加载远端配置

当前状态：

- 已落地
- 已纳入本地分布式启动流程

### 2. Nacos Discovery

用途：

- 服务注册
- 服务发现
- 网关和服务间调用的服务名解析

当前状态：

- 已落地
- 已纳入本地分布式启动流程

## 当前与 Spring Cloud 共同使用的核心组件

这部分不属于 Spring Cloud Alibaba 本身，但它们是这套微服务实际可运行的关键组成。

### 1. Spring Cloud Gateway

模块：

- `fresh-gateway`

用途：

- 统一入口
- 路由转发
- 跨域处理
- 访问控制前置能力

### 2. OpenFeign

用途：

- 微服务之间的 RPC 风格调用
- 各模块 API 接口互相引用

项目里可以看到大量 `@FeignClient` 和 `@EnableFeignClients`，说明服务间调用是按 Spring Cloud 常见方式组织的。

## 这套工程里当前可以启动的组件

这里分成两类看：基础中间件、业务微服务。

### 一、基础中间件

#### 1. Nacos

用途：

- 配置中心
- 注册中心

默认地址：

- `http://127.0.0.1:8848/nacos`

启动情况：

- `script/local/start-distributed.sh` 会优先启动 Nacos

#### 2. MySQL

用途：

- 业务主数据库

启动情况：

- 项目依赖 MySQL
- 但当前仓库脚本不会帮你启动 MySQL，需要本机自行保证可用

#### 3. Redis

用途：

- 缓存
- 分布式锁
- 部分状态共享

启动情况：

- 项目依赖 Redis
- 当前仓库脚本不会帮你启动 Redis，需要本机自行保证可用

#### 4. RocketMQ

用途：

- 代码层面具备接入能力
- 部分模块存在 `rocketmq` 配置与相关 starter

启动情况：

- 当前仓库没有把 RocketMQ 纳入默认分布式启动脚本
- 所以它属于“具备接入能力，但不是当前默认一起拉起的组件”

### 二、业务微服务

`script/local/start-distributed.sh` 当前会启动这些服务：

| 服务名 | 模块 | 端口 |
| --- | --- | ---: |
| `system-server` | `fresh-module-system/fresh-module-system-server` | `48081` |
| `infra-server` | `fresh-module-infra/fresh-module-infra-server` | `48082` |
| `pay-server` | `fresh-module-pay/fresh-module-pay-server` | `48085` |
| `member-server` | `fresh-module-member/fresh-module-member-server` | `48087` |
| `wms-server` | `fresh-module-wms/fresh-module-wms-server` | `48092` |
| `product-server` | `fresh-module-mall/fresh-module-product-server` | `48100` |
| `promotion-server` | `fresh-module-mall/fresh-module-promotion-server` | `48101` |
| `trade-server` | `fresh-module-mall/fresh-module-trade-server` | `48102` |
| `statistics-server` | `fresh-module-mall/fresh-module-statistics-server` | `48103` |
| `fresh-gateway` | `fresh-gateway` | `48080` |

## 单体模式也还在，但当前不推荐

仓库里仍然保留：

- `fresh-server`

它本身也接了 Nacos 相关依赖，说明项目同时兼容单体聚合模式。  
不过当前本地脚本和现有文档都已经把重点放在 **分布式启动**，因此更适合把它当作兼容保留，而不是主运行方式。

## 当前没有确认落地的 Alibaba 组件

按当前仓库代码和配置来看，**没有足够证据** 说明下面这些已经在本项目里正式启用：

- Sentinel
- Seata
- Dubbo

所以当前不应把项目描述成“完整 Spring Cloud Alibaba 全家桶”。

更合适的说法是：

- 已使用 Spring Cloud Alibaba
- 实际已落地的核心组件是 Nacos
- 其余常见 Alibaba 组件目前未见正式启用

## 推荐理解方式

如果你后面要对外介绍这套项目，建议直接用下面这句：

> `fresh-distribution` 采用 Spring Cloud + Spring Cloud Alibaba 架构，当前已落地 Nacos 配置中心与服务注册发现，配合 Gateway 和 OpenFeign 组织分布式业务服务。

## 相关文档

- 分布式服务总览：`docs/runbook/distributed-services.md`
- 本文档：`docs/runbook/spring-cloud-alibaba-components.md`
