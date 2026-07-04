# Fresh Distribution Bootstrap Design

## 背景

当前仓库 `/Users/zhiwengong/code/code/Java/Team/distribution/yudao-cloud` 是芋道云完整版脚手架，覆盖系统、基础设施、会员、支付、商城、WMS 以及多种非一期必需业务模块。

本次目标不是直接实现“生鲜配送微信小程序系统一期”的完整业务，而是先把当前仓库裁剪成一个更贴近生鲜项目的可持续脚手架，作为后续开发分拣、后厨/水产、打包打印、骑手配送等能力的基础。

项目统一名称确定为 `fresh-distribution`。

## 目标

本次调整完成后，仓库应满足以下目标：

- 保留一期生鲜项目最需要的基础能力和交易能力
- 去掉明显无关的一期外模块，降低认知成本和后续维护成本
- 将仓库、模块、Spring 应用名、文档脚本中的项目名统一改造成 `fresh-distribution` 语义
- 保持 Java 包名 `cn.iocoder.yudao...` 不变，避免一次性引入高风险大迁移
- 为后续新增生鲜专属履约模块预留清晰边界

## 非目标

本次明确不做以下事项：

- 不修改 Java 包名、类全限定名、数据库表前缀
- 不重写现有商城、支付、WMS 的业务语义
- 不补齐小程序前端和后台前端仓库代码
- 不直接实现分拣、后厨/水产、打印、骑手、美团对接等一期定制功能
- 不把微服务架构重构为模块化单体

## 推荐方案

采用“裁剪使用 + 统一命名 + 暂不深迁移”的方案：

1. 以 `yudao-cloud` 完整版作为后端业务脚手架
2. 保留 `system / infra / member / pay / mall / wms / gateway / framework / server / dependencies`
3. 停用 `bpm / report / mp / erp / crm / iot / mes / im / ai`
4. 将目录名、Maven 模块名、artifactId、Spring 应用名、主要文档说明统一改造成 `fresh-distribution` 体系
5. 保留 Java 包名与大部分内部类名，控制风险和改动面

这是风险、收益、后续可维护性之间最平衡的做法。

## 模块裁剪设计

### 保留模块

以下模块作为一期脚手架核心保留：

- `yudao-dependencies`
- `yudao-framework`
- `yudao-gateway`
- `yudao-server`
- `yudao-module-system`
- `yudao-module-infra`
- `yudao-module-member`
- `yudao-module-pay`
- `yudao-module-mall`
- `yudao-module-wms`

保留原因：

- `system`：登录、权限、组织、字典、社交登录、小程序相关基础能力
- `infra`：文件存储、任务、配置、日志、代码生成、监控基础设施
- `member`：会员、地址、积分等用户侧基础能力
- `pay`：微信小程序支付、退款、支付回调等核心交易链路
- `mall`：商品、营销、购物车、订单、售后、统计等电商核心链路
- `wms`：仓库、库存、入库、出库、移库、盘库等仓内基础能力

### 停用模块

以下模块从一期脚手架中停用：

- `yudao-module-bpm`
- `yudao-module-report`
- `yudao-module-mp`
- `yudao-module-erp`
- `yudao-module-crm`
- `yudao-module-iot`
- `yudao-module-mes`
- `yudao-module-im`
- `yudao-module-ai`

停用原则：

- 与一期生鲜项目闭环无强依赖
- 引入后会增加配置、部署、阅读和测试成本
- 未来如果确有需要，可以单独评估重新接入

### 停用方式

本次优先采用“从聚合构建和默认启动链路中移除”的停用方式，而不是立即删除代码目录：

- 从根 `pom.xml` 中移除对应 module 引用
- 从 `yudao-server` 聚合依赖或服务编排中移除相关模块
- 从文档、脚本、环境说明中删除这些模块的默认启动路径

这样可以先让脚手架瘦身，又保留未来回看或局部复用的可能性。

## 命名改造设计

### 根仓库命名

统一将当前项目从 `yudao-cloud` 语义切换到 `fresh-distribution` 语义：

- 仓库目录名：`yudao-cloud` -> `fresh-distribution`
- 根项目 artifact：`yudao` -> `fresh-distribution`
- 根项目名称与描述改成生鲜配送脚手架语义

### 模块目录与 artifact 命名

模块命名采用“`fresh-*` 或 `fresh-module-*`”形式，保留原有成熟业务语义：

- `yudao-dependencies` -> `fresh-dependencies`
- `yudao-framework` -> `fresh-framework`
- `yudao-gateway` -> `fresh-gateway`
- `yudao-server` -> `fresh-server`
- `yudao-module-system` -> `fresh-module-system`
- `yudao-module-infra` -> `fresh-module-infra`
- `yudao-module-member` -> `fresh-module-member`
- `yudao-module-pay` -> `fresh-module-pay`
- `yudao-module-mall` -> `fresh-module-mall`
- `yudao-module-wms` -> `fresh-module-wms`

模块内部子模块继续保留业务语义，但统一 `fresh` 前缀，例如：

- `yudao-module-product-server` -> `fresh-module-product-server`
- `yudao-module-promotion-server` -> `fresh-module-promotion-server`
- `yudao-module-trade-server` -> `fresh-module-trade-server`
- `yudao-module-wms-server` -> `fresh-module-wms-server`

这里不强行把 `mall` 改成“生鲜商城”或把 `wms` 改成“履约中心”，因为现阶段保留成熟语义更利于沿用已有模块边界和社区资料。

### Spring 应用名

各服务应用名统一改造成 `fresh-*` 命名，例如：

- `fresh-system-server`
- `fresh-infra-server`
- `fresh-member-server`
- `fresh-pay-server`
- `fresh-product-server`
- `fresh-promotion-server`
- `fresh-trade-server`
- `fresh-statistics-server`
- `fresh-wms-server`
- `fresh-gateway`

这部分会同步调整：

- `spring.application.name`
- Nacos / 配置中心相关默认 service name
- Docker / 脚本 / 文档里引用的服务名

### 文档与脚本命名

所有对外可见的仓库说明、脚本说明、初始化文档应切换到 `fresh-distribution` 语义：

- 根 `README.md`
- 模块 `pom.xml` 中的 `name` / `description`
- 启动脚本、部署脚本中的项目名称
- 默认示例命令和文档中的 `yudao-cloud` / `yudao` 文本

## 生鲜项目适配边界

本次不会把现有 `mall` 和 `wms` 直接改造成生鲜专属模块，而是将它们作为底座保留。

后续生鲜一期定制能力建议新增在新的业务模块中，而不是把所有生鲜流程硬塞进现有模块：

- 预留新增模块：`fresh-module-fulfillment`
- 预留新增模块：`fresh-module-delivery`

建议职责边界：

- `mall`：用户下单、商品、营销、订单、售后、价格计算
- `wms`：库存、仓库、入出库、库存变动、仓内数据底座
- `fulfillment`：分拣、加工、打包、待销回库、履约任务
- `delivery`：配送单、骑手、自有配送、第三方配送对接

这样后续的生鲜业务能力会更聚焦，也不会把现有模块改成难以维护的“大杂烩”。

## 影响面

本次裁剪和改名会影响以下层面：

- 根目录结构
- 聚合 `pom.xml` 与模块 `pom.xml`
- 模块依赖关系
- Spring 应用名与配置文件
- README、脚本、部署说明中的项目命名
- 可能依赖服务名的本地开发和部署脚本

本次不会影响以下层面：

- Java 包路径
- 大部分业务实现代码逻辑
- 数据库核心表结构
- 外部 API 的业务字段命名

## 风险与控制

### 主要风险

1. 目录与 artifact 改名后，聚合构建关系失效
2. Spring 应用名改动后，注册中心或配置中心引用不一致
3. 文档与脚本遗漏旧名称，导致本地启动体验混乱
4. 误删当前仍被依赖的模块，导致构建或启动失败

### 控制策略

1. 分两阶段做：先裁剪模块，再统一改名
2. 每一阶段都执行最小构建验证
3. 对停用模块采用“先移出聚合、后决定是否删除目录”的方式
4. 不做 Java 包名迁移，避免指数级扩大影响面

## 验证策略

实施阶段至少应完成以下验证：

- 根 Maven 聚合能成功识别保留模块
- 停用模块不再参与默认构建链路
- 保留模块的父子 `pom` 引用正确
- 关键服务的 `spring.application.name` 已切换到 `fresh-*`
- README 与主要脚本文本不再默认暴露 `yudao-cloud` 作为项目身份

如果执行阶段允许，建议补充：

- 根仓库一次 `mvn -q -DskipTests package` 或等价聚合验证
- 至少一个核心服务的本地启动验证

## 实施顺序建议

推荐的实施顺序如下：

1. 新增本设计文档，作为裁剪依据
2. 调整根 `pom.xml`，移除停用模块
3. 调整 `server` 及相关聚合依赖，仅保留一期需要模块
4. 重命名仓库根项目、模块目录、artifactId
5. 调整 `spring.application.name` 与相关配置引用
6. 更新 README、脚本、文档说明
7. 执行构建与配置校验

## 最终结论

`yudao-cloud` 完整版适合作为 `fresh-distribution` 生鲜配送项目的一期后端脚手架，但应通过“保留交易与仓储核心模块、停用非必需模块、统一项目命名、暂不深迁移包名”的方式进行收敛。

这样可以在不推倒现有成熟业务底座的前提下，把仓库调整为一个更贴近生鲜项目、后续更容易持续演进的基础工程。
