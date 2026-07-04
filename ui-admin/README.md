# fresh-distribution-ui-admin

当前前端工程已并入后端主仓库，默认路径为：

- `fresh-distribution/ui-admin`

`fresh-distribution-ui-admin` 是面向生鲜配送项目的一期后台前端脚手架，基于现有 Vue 管理后台体系收敛而来，默认对接后端仓库 `fresh-distribution`。

## 项目背景

当前前端脚手架服务于同一套生鲜配送业务闭环：

- 小程序侧用户下单、支付、售后
- 后台商品、库存、营销、订单、会员、配送配置
- 仓内分拣、复核、加工、交接
- 运维侧账号权限、日志、监控入口

一期目标是优先提供一个“能直接接后端、能继续裁剪、能快速二开”的管理后台底座，而不是一次性做完所有行业能力。

## 当前定位

- 主应用：`apps/fresh-distribution-admin`
- 默认标题：`生鲜配送管理系统`
- 默认启动命令：`pnpm dev:fresh-admin`
- 默认后端地址：`http://127.0.0.1:48080/admin-api`

## 已保留的核心业务边界

- `system`：系统管理
- `infra`：基础设施
- `member`：会员中心
- `mall`：商品、交易、营销
- `pay`：支付相关
- `wms`：仓储与库存执行
- `dashboard`：运营看板

## 当前处理策略

本轮优先做了适合直接落地的改造：

- 主应用目录改为 `fresh-distribution-admin`
- 默认项目标题、仓库信息、帮助链接切换为生鲜项目语义
- 保留可运行的底层框架命名，避免一次性深改导致联调成本过高

以下内容暂未做高风险迁移：

- `@vben/*` 相关框架包名
- 运行时内部常量命名
- 与后端兼容相关的部分历史注释 / 结构

## 本地开发

```bash
pnpm install
pnpm dev:fresh-admin
```

默认访问地址：

- [http://localhost:5999](http://localhost:5999)

## 在 monorepo 中使用

如果你是从后端主仓库根目录进入：

```bash
cd ui-admin
pnpm install
pnpm dev:fresh-admin
```

## 建议的后续工作

- 补充登录页、Logo、favicon 与品牌主视觉
- 联动后端菜单、权限、字典做一轮生产化清理
- 继续删除一期不用的页面、路由与 API 封装
- 针对分拣、加工、配送、打印等角色补齐专属工作台
