# Fresh Distribution Bootstrap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将当前 `yudao-cloud` 后端仓库裁剪为面向生鲜配送项目的 `fresh-distribution` 脚手架，保留一期所需核心模块并统一项目命名。

**Architecture:** 先从聚合构建链路中移除非一期模块，再对保留模块做目录名、Maven artifact、Spring 应用名和文档脚本命名统一。保持 Java 包名不变，降低回归风险。

**Tech Stack:** Maven multi-module, Spring Boot 2.7, Spring Cloud Alibaba, Nacos, YAML configuration, shell scripts.

---

### Task 1: 裁剪聚合模块

**Files:**
- Modify: `/Users/zhiwengong/code/code/Java/Team/distribution/yudao-cloud/pom.xml`
- Modify: `/Users/zhiwengong/code/code/Java/Team/distribution/yudao-cloud/yudao-server/pom.xml`
- Test: Maven reactor module resolution from repo root

- [ ] 移除根 `pom.xml` 中非一期模块：`bpm/report/mp/erp/crm/iot/mes/im/ai`
- [ ] 在 `yudao-server/pom.xml` 中显式启用 `member/pay/product/promotion/trade/statistics/wms`，并保持停用模块不再进入默认单体容器
- [ ] 运行一次最小 Maven 构建，确认聚合模块关系仍然有效

### Task 2: 重命名保留模块目录与 Maven 标识

**Files:**
- Modify: retained module `pom.xml` files under repo root and submodules
- Rename: retained root module directories and retained submodule directories
- Test: Maven parent/child linkage after rename

- [ ] 将保留根模块目录重命名为 `fresh-*` / `fresh-module-*`
- [ ] 将保留子模块目录重命名为 `fresh-module-*-api/server`
- [ ] 更新所有保留模块 `pom.xml` 中的 `<module>`、`<artifactId>`、父子依赖引用
- [ ] 运行 Maven 构建，确认重命名后的 reactor 与依赖坐标正确

### Task 3: 更新 Spring 应用名与脚本文档引用

**Files:**
- Modify: retained `application.yaml`, `application-local.yaml`, `application-dev.yaml`
- Modify: `/Users/zhiwengong/code/code/Java/Team/distribution/yudao-cloud/README.md`
- Modify: files under `/Users/zhiwengong/code/code/Java/Team/distribution/yudao-cloud/script`
- Test: text scan for stale retained-project naming

- [ ] 将保留服务 `spring.application.name` 统一改成 `fresh-*`
- [ ] 更新根 README、模块描述和脚本中的 `yudao-cloud` 项目身份文案为 `fresh-distribution`
- [ ] 保留对第三方官方仓库链接的必要引用，不强行改动外部项目名
- [ ] 通过文本扫描确认保留链路中不存在应当迁移但遗漏的项目命名

### Task 4: 根项目命名收口与仓库目录改名

**Files:**
- Modify: root `/Users/zhiwengong/code/code/Java/Team/distribution/yudao-cloud/pom.xml`
- Rename: repo directory `/Users/zhiwengong/code/code/Java/Team/distribution/yudao-cloud`
- Test: Maven invocation from renamed repo path

- [ ] 将根项目 `<artifactId>` 从 `yudao` 改为 `fresh-distribution`
- [ ] 更新根项目 `<description>` 到生鲜配送脚手架语义
- [ ] 将仓库目录从 `yudao-cloud` 重命名为 `fresh-distribution`
- [ ] 在新路径下执行 Maven 构建验证

### Task 5: 最终验证与变更说明

**Files:**
- Modify: implementation plan checkbox state if needed
- Test: full verification commands and git diff review

- [ ] 运行最终验证命令，记录构建或已知失败原因
- [ ] 扫描保留模块路径中的旧命名残留，确认是否仅剩刻意保留的 Java 包名或外部链接
- [ ] 汇总最终结果、风险和后续建议
