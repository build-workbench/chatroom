# 2026-03-06 教学友好文档、测试与发布流程对齐

## 后端

### WebSocket 测试稳定性修复
- `internal/ws/hub_test.go` 新增统一的 `startTestRoomHub` 测试启动辅助函数
- 不再在测试中直接关闭 `register` channel，改为通过 `Stop()` 做规范清理
- 广播测试改为忽略先前的 `join` 事件，仅校验目标广播消息，降低并发场景下的脆弱性

### Router 测试环境兼容
- `internal/server/router_test.go` 在 SQLite 驱动要求 CGO 的环境下改为跳过测试
- 避免因为本地或 CI 的 CGO 差异导致整套测试直接失败

## 前端

### 单元测试链路改造
- `frontend/src/storage.test.ts` 改为基于 Node 原生 test runner 的单元测试
- 引入内存版 `localStorage` mock，消除对浏览器与 Vitest 运行时的强依赖
- 新增 `frontend/tsconfig.test.json`，将测试编译输出到独立目录
- `frontend/package.json` 的 `test`、`test:watch`、`test:coverage` 脚本改为走稳定的编译后测试流程

### Toast 结构调整与 lint 修复
- 新增 `frontend/src/toast-context.ts`，把 `ToastContext` 与 `useToast` 从组件文件中拆出
- `toast.tsx` 仅保留 `ToastProvider` 组件导出，满足 React Fast Refresh 规则
- `App.tsx` 调整 effect 清理逻辑，避免 ref cleanup 警告

## 文档

### README 重写
- 根部 `README.md` 改为贴合实际项目状态的中文说明
- 明确项目定位是“练手 + 教学”，不以生产为目标
- 补充本地启动方式、手动测试步骤、`frontend/` 与 `web/` 的职责划分
- 增加 GitHub Release 使用说明与 `.env.example` 引导

### 仓库文档中文化与项目化
- `AGENTS.md` 全量改为中文，并强调教学友好、可运行、可测试
- `frontend/README.md` 从 Vite 模板文案改为项目专用说明
- 新增根目录 `.env.example`

### 教学文档站
- 在 `docs/` 目录上引入 `VitePress` 文档站骨架
- 新增首页、快速开始、手动测试实验、FAQ 等教学型页面
- 保留 `API.md`、`ARCHITECTURE.md`、`DESIGN.md`、`monitoring/README.md` 作为核心内容页
- 修正 `docs/DESIGN.md` 中对当前前端结构的过时描述

## 工程化与自动化

### CI 与 Release 对齐
- `.github/workflows/ci.yml` 增加前端测试步骤
- `.github/workflows/release.yml` 新增校验阶段，先执行 Go 测试与前端测试
- Release 构建拆分为前端静态资源构建与多平台后端打包
- 发布产物改为包含二进制、`frontend/dist`、`README.md`、`LICENSE`、`.env.example` 的可运行包

### 仓库清理
- `.gitignore` 增加 `frontend/.test-dist/` 忽略规则

### 文档站部署
- 新增 `.github/workflows/docs.yml`，将文档站自动发布到 GitHub Pages
- `README.md` 增加文档站本地开发和在线部署说明
- `.gitignore` 增加 `docs/.vitepress/cache/` 与 `docs/.vitepress/dist/` 忽略规则
