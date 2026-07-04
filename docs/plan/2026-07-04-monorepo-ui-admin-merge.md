# Fresh Distribution Monorepo UI Merge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有 `fresh-distribution-ui-admin` 以前端子工程方式并入 `fresh-distribution`，形成单仓库入口，并把前端默认主题切换为白色。

**Architecture:** 后端继续保持 Maven 多模块结构不变，前端整体落到仓库根目录 `ui-admin/`，保留其 `pnpm` monorepo 结构，避免与后端构建链互相污染。仓库根 README 增加 monorepo 说明，前端默认主题从 `dark` 改为 `light`。

**Tech Stack:** Maven multi-module, Vue 3, vue-vben-admin monorepo, pnpm workspace, TypeScript

---

### Task 1: 合并前端目录

**Files:**
- Create: `ui-admin/**`
- Modify: `.gitignore`（如需要）

- [ ] 将 `/Users/zhiwengong/code/code/Java/Team/distribution/fresh-distribution-ui-admin` 拷贝到仓库内 `ui-admin/`
- [ ] 清理 `ui-admin/.git`、`ui-admin/node_modules` 等不应进入 monorepo 的产物
- [ ] 保留前端源码、`pnpm-lock.yaml`、`pnpm-workspace.yaml`、`apps/`、`packages/`、`scripts/`

### Task 2: 切换默认白色主题

**Files:**
- Modify: `ui-admin/packages/@core/preferences/src/config.ts`

- [ ] 将默认主题模式从 `dark` 调整为 `light`
- [ ] 保持现有品牌、布局与功能配置不变，只切换默认视觉基线

### Task 3: 补充 monorepo 文档

**Files:**
- Modify: `README.md`

- [ ] 在根 README 中补充 `ui-admin/` 目录说明
- [ ] 增加后端与前端各自启动命令
- [ ] 明确说明前后端共仓但分别构建

### Task 4: 验证与发布

**Files:**
- Modify: Git index / commit history

- [ ] 运行前端类型检查
- [ ] 检查仓库状态与关键目录
- [ ] 提交 monorepo 变更
- [ ] 推送到 `origin/main`
