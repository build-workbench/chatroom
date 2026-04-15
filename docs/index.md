---
layout: home
hero:
  name: ChatRoom 教学文档
  text: 从零理解实时聊天系统
  tagline: Go + React + PostgreSQL + WebSocket，一个适合练手与教学的全栈项目
  actions:
    - theme: brand
      text: 快速开始
      link: /getting-started
    - theme: alt
      text: API 文档
      link: /API
    - theme: alt
      text: 架构概览
      link: /ARCHITECTURE
features:
  - icon: 🚀
    title: 5 分钟启动
    details: Docker Compose 一键启动数据库和后端，前端开发服务器热更新，快速体验完整聊天功能。
  - icon: 🔐
    title: JWT 双 Token
    details: Access Token + Refresh Token 完整实现，支持自动刷新、Token Rotation、安全登出。
  - icon: ⚡
    title: WebSocket 实时
    details: 房间级 Hub 广播、在线状态同步、输入提示、心跳保活，支持分布式部署。
  - icon: 📊
    title: Prometheus 监控
    details: 内置 HTTP 请求、WebSocket 连接、消息计数指标，配套 Grafana 仪表盘模板。
  - icon: 🧪
    title: 测试完备
    details: Go 单元测试 + 集成测试，前端 Vitest 测试，CI 自动运行，覆盖率报告。
  - icon: 📦
    title: 生产就绪
    details: Docker 多阶段构建、Kubernetes 部署清单、健康检查、优雅停服、速率限制。
---

## 技术栈

| 后端 | 前端 | 数据库 | 监控 | 部署 |
|------|------|--------|------|------|
| Go 1.24 | React 19 | PostgreSQL 16 | Prometheus | Docker |
| Gin | TypeScript | GORM | Grafana | Kubernetes |
| gorilla/websocket | Vite 7 | zerolog | | GitHub Actions |
| zerolog | Tailwind CSS v4 | | | |

## 这份文档适合谁

- 想用一个小项目**练习 Go 后端开发**的人
- 想理解**前端如何接入 REST + WebSocket**的人
- 想把这个仓库当成**课堂演示或自学教材**的人

## 你将学到什么

### 后端

- Gin 路由与中间件的组织方式
- JWT / Refresh Token 鉴权流程
- GORM 与 PostgreSQL 的配合方式
- WebSocket 房间广播的实现
- 分布式消息同步（PostgreSQL NOTIFY）

### 前端

- React Hooks 状态管理
- WebSocket 连接与重连策略
- Token 自动刷新机制
- TypeScript 类型设计

### 工程化

- 测试编写与 CI 配置
- Docker 多阶段构建
- Kubernetes 部署清单
- Prometheus 监控集成

## 推荐阅读顺序

1. [快速开始](/getting-started) — 5 分钟启动项目
2. [手动测试实验](/manual-testing) — 验证核心功能
3. [API 文档](/API) — REST + WebSocket 接口
4. [架构文档](/ARCHITECTURE) — 系统分层与数据流
5. [设计文档](/DESIGN) — 设计决策与扩展方向
6. [常见问题](/FAQ) — 问题解答

## 项目特色

### 教学优先

代码清晰易懂，避免过度抽象，每个模块都有详细注释和文档说明。

### 工程完备

不是简单的 Demo，而是包含测试、CI、部署、监控的完整工程实践。

### 循序渐进

从"能跑"到"能看懂"到"能改"，文档提供清晰的学习路径。

## 快速体验

```bash
# 克隆项目
git clone https://github.com/LessUp/chatroom.git
cd chatroom

# 启动数据库
docker compose up -d postgres

# 启动后端
go run ./cmd/server

# 启动前端（另一终端）
npm --prefix frontend ci
npm --prefix frontend run dev
```

然后访问 http://localhost:5173 开始体验！
