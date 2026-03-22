# 常见问题

## 这个项目是面向生产的吗？

不是。

它的主要目标是个人练手与教学演示，因此更强调：

- 易运行
- 易阅读
- 易讲解
- 易验证

不过它并不只是一个“只会本地跑一下”的 demo。仓库里已经包含测试、CI、Release、Docker Compose、Kubernetes 清单和文档站，适合拿来学习一个小项目如何逐步工程化。

## 为什么同时有 `frontend/` 和 `web/`？

- `frontend/` 是 React 主前端，用于开发、测试和构建
- `web/` 是静态回退界面，用于在 `frontend/dist` 不存在时仍能直接演示项目

这是一个很适合教学的设计，因为你可以顺带讲清楚“构建产物托管”和“静态回退”的概念。

## 我应该先看哪一部分代码？

建议顺序是：

1. `cmd/server/main.go`
2. `internal/server/`
3. `internal/config/`
4. `internal/service/`
5. `internal/ws/`
6. `frontend/src/App.tsx`

## 为什么既有 REST API，又有 WebSocket？

因为它们解决的问题不同：

- REST 适合注册、登录、查房间、查历史消息
- WebSocket 适合实时消息、在线人数、输入状态等事件推送

这也是这个项目最适合拿来教学的地方之一。

## 前端测试为什么没有继续用 Vitest？

当前仓库里的 `rolldown-vite` 组合在测试场景下有兼容性问题。

为了保证这个教学项目“测试能稳定通过”，目前前端单元测试采用了更直接、可控的 `TypeScript 编译 + Node 原生 test runner` 方案。

## `.env.example` 复制成 `.env` 后为什么没有自动生效？

因为当前后端代码不会自动加载 `.env` 文件。

服务读取的是进程环境变量，而仓库根目录中的 `.env.example` 的作用是：

- 给你一个可参考的配置模板
- 作为 Docker / Compose / CI / 部署环境的变量清单
- 帮助你了解项目支持哪些配置项

如果你直接执行 `go run ./cmd/server`，需要确保运行环境中已经提供了需要的环境变量。

## `ALLOWED_ORIGINS` 是做什么的？

它用于非 `dev` 环境下的来源校验：

- HTTP 请求走 CORS 校验
- WebSocket 升级请求也走同一套来源校验逻辑

如果没有命中允许列表，服务会退回到严格同源判断，而不是无条件放开。

## 文档站会自动发布吗？

会。

仓库中已经包含 GitHub Pages 工作流。当前配置下，推送到默认分支 `master` 的相关文档改动会触发文档站构建与部署；首次使用时仍需要在仓库设置中启用 GitHub Pages。
