# Fresh Distribution

`fresh-distribution` 是一个面向生鲜配送场景的一期后端脚手架，基于上游微服务完整版裁剪而来，当前目标不是交付“通用平台”，而是给生鲜微信小程序、管理后台、仓内作业和配送履约提供一个可持续演进的分布式底座。

## 项目背景

这套系统服务于典型的生鲜前置仓/门店配送场景，核心业务链路包括：

- 用户通过微信小程序完成登录、选品、加购、下单、支付、售后
- 后台完成商品、库存、订单、营销、会员、配送配置等管理
- 仓内完成分拣、复核、交接、异常登记
- 后厨/水产区完成加工任务处理
- 履约侧支持自有骑手与第三方配送的基础对接

一期范围优先覆盖“能稳定跑通业务闭环”的能力，不以大型互联网级秒杀平台为目标，而是先满足门店/前置仓日常经营、高峰期订单处理和基础并发保障。

## 一期业务范围

### 用户侧

- 微信登录与手机号授权
- 商品分类、搜索、详情、购物车
- 到货日期、生产日期、加工日期等生鲜信息展示
- 地址、配送时间段、备注、优惠券、红包、满减
- 最近购买、常买商品、再来一单
- 微信支付、订单查询、配送状态、基础售后

### 营销侧

- 新人券 / 新人红包
- 满减活动与凑单提醒
- 复购券
- 邀请新人得券
- 晚市出清
- 轻量限时活动
- 会员积分累计

### 管理后台

- 商品管理：分类、规格、价格、图文、温层、是否称重、是否支持加工
- 库存管理：采购入库、出库、库存调整、损耗、临期提醒
- 订单管理：订单流转、取消、退款、售后
- 营销配置：优惠券、满减、晚市出清、限时活动
- 会员积分：规则、明细、退款扣回
- 配送配置：范围、时段、配送费
- 运维基础：账号、角色、权限、操作日志

### 仓内与履约

- 分拣任务分发、接单、计时、超时记录
- 多单并拣、扫码确认、缺货备注、打包复核
- 后厨 / 水产加工任务
- 订单小票、拣货单、标签等基础打印模板
- 自有骑手配送状态同步
- 第三方配送基础接口对接

## 一期暂不纳入

- 复杂分销与佣金提现
- 积分商城与复杂会员等级
- 大型秒杀专项架构
- PDA 厂商 SDK 深度适配
- 蓝牙打印、电子秤自动读数、自动贴标等深度硬件联动

## 当前仓库定位

当前仓库现在采用“后端 + 前端同仓”的轻量 monorepo 组织方式，更适合作为“生鲜配送全栈脚手架”，不是最终业务成品。它的价值在于：

- 先把微服务拆分、网关、注册中心、运维骨架稳定下来
- 用现成的系统、基础设施、会员、支付、商城、仓储能力快速起盘
- 前后端入口统一到一个仓库，降低联调、交接和部署沟通成本
- 后续把分拣、加工、配送、打印等生鲜专属能力继续下沉为独立模块

## 当前保留模块

- `fresh-dependencies`
- `fresh-framework`
- `fresh-gateway`
- `fresh-server`
- `fresh-module-system`
- `fresh-module-infra`
- `fresh-module-member`
- `fresh-module-pay`
- `fresh-module-mall`
- `fresh-module-wms`

其中：

- `mall` 负责商品、营销、购物车、订单、售后
- `wms` 负责仓库、库存、出入库、库存台账
- `system` 负责账号、权限、菜单、认证
- `infra` 负责文件、日志、任务、监控后台等基础能力

## 本轮已移除模块

以下上游模块已从当前脚手架中物理移除：

- `yudao-module-bpm`
- `yudao-module-report`
- `yudao-module-mp`
- `yudao-module-erp`
- `yudao-module-crm`
- `yudao-module-iot`
- `yudao-module-mes`
- `yudao-module-im`
- `yudao-module-ai`

## 目录结构

```text
fresh-distribution/
├── fresh-dependencies
├── fresh-framework
├── fresh-gateway
├── fresh-server
├── fresh-module-system
├── fresh-module-infra
├── fresh-module-member
├── fresh-module-pay
├── fresh-module-mall
├── fresh-module-wms
├── ui-admin
├── docs
├── script
└── sql
```

## Monorepo 结构说明

仓库当前包含两个主要子系统：

- 后端：Maven 多模块微服务工程，负责网关、系统、基础设施、会员、支付、商城、仓储等服务
- 前端：`ui-admin/` 下的 `pnpm` monorepo，主应用为 `ui-admin/apps/fresh-distribution-admin`

两者共仓管理，但仍分别构建：

- 后端不把前端纳入 Maven modules
- 前端也不依赖后端 Maven 构建链
- 联调时通过网关地址 `http://127.0.0.1:48080/admin-api` 对接

## 分布式架构说明

当前推荐使用分布式方式启动，而不是单点 `fresh-server`：

- 网关：`fresh-gateway`
- 系统服务：`system-server`
- 基础设施服务：`infra-server`
- 会员服务：`member-server`
- 支付服务：`pay-server`
- WMS 服务：`wms-server`
- 商品服务：`product-server`
- 营销服务：`promotion-server`
- 交易服务：`trade-server`
- 统计服务：`statistics-server`

详细说明见 [docs/runbook/distributed-services.md](docs/runbook/distributed-services.md)。

## 稳定性与运维基础

当前工程已经具备以下分布式基础能力：

- Nacos 注册 / 服务发现
- Spring Cloud Gateway 统一入口
- Spring Boot Admin Server / Client
- 接口访问日志、错误日志
- Redis 缓存与分布式锁基础
- 后续可接入 Prometheus / Grafana / SkyWalking / ELK

当前仍需补齐的生产级能力：

- Prometheus + Grafana 面板体系
- 链路追踪后端
- 集中式日志平台
- 告警编排与高可用方案

## 兼容性说明

为了优先保证当前工程可运行、可扩展，本轮没有做高风险底层迁移，以下内容暂时保留：

- Java 包名仍为 `cn.iocoder.yudao...`
- 部分配置前缀仍沿用原始命名
- 默认数据库名当前仍兼容旧库名

这些内容后续如果要统一替换，建议单独做一轮“深度重命名与回归验证”。

## 快速开始

### 构建

```bash
mvn -DskipTests package
```

### 后端分布式启动

```bash
bash script/local/start-distributed.sh
```

停止：

```bash
bash script/local/stop-distributed.sh
```

### 前端启动

```bash
cd ui-admin
pnpm install
pnpm dev:fresh-admin
```

默认访问地址：

- `http://localhost:5999`

## 建议的后续扩展模块

建议将生鲜专属能力继续演进为独立模块，而不是把所有流程继续堆进现有 `mall` / `wms`：

- `fresh-module-fulfillment`
- `fresh-module-delivery`
- `fresh-module-processing`
- `fresh-module-printing`

建议职责：

- `fulfillment`：分拣、复核、待销回库
- `delivery`：配送单、骑手、自配、第三方配送
- `processing`：后厨加工、水产加工、称重补录
- `printing`：小票、标签、打印任务与日志

## 上游来源

本仓库由上游微服务完整版收敛而来，但当前仓库的业务边界、模块选择和启动方式均以 `fresh-distribution` 为准。
