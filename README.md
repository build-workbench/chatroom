# ChatRoom

[![CI](https://github.com/LessUp/chatroom/actions/workflows/ci.yml/badge.svg)](https://github.com/LessUp/chatroom/actions/workflows/ci.yml)
|[![Docs](https://github.com/LessUp/chatroom/actions/workflows/pages.yml/badge.svg)](https://lessup.github.io/chatroom/)
|[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

一个全栈开发教学项目，用 **Go + React + PostgreSQL + WebSocket** 实现一个可运行、可读懂的实时聊天室。

## 这个项目是什么

这是一个**定稿的教学项目**：代码不再迭代，定位为全栈开发学习参考。它覆盖了一个真实系统从认证到实时通信的完整链路，刻意保持小而清晰，适合通读。

### 你能从这里学到什么

| 层面 | 知识点 |
|------|--------|
| 认证 | JWT 双 Token（Access + Refresh）轮换、bcrypt 密码哈希、WebSocket 一次性票据认证 |
| 实时通信 | 房间级 Hub goroutine 模型、Channel 广播、心跳保活、慢客户端踢出 |
| 后端架构 | Gin 路由与中间件、Handler / Service / Model 三层分离、依赖注入 |
| 前端架构 | React Hooks 状态管理、WebSocket 封装与重连、Token 自动刷新拦截 |
| 数据持久化 | GORM 模型设计、连接池、分页查询、过期数据清理 |
| 工程化 | Go + 前端双端测试、Docker 多阶段构建、VitePress 文档站、GitHub Actions CI |

### 推荐阅读路线

如果你打算通读源码，建议按以下顺序：

1. **`cmd/server/main.go`** — 启动流程：配置加载 → 数据库 → Hub → 路由 → 优雅停服
2. **`internal/config/config.go`** — 配置来源：环境变量读取、校验、日志初始化
3. **`internal/server/router.go`** — 路由全貌：中间件链、REST 端点、WebSocket 端点
4. **`internal/server/handler.go`** — HTTP Handler：请求校验、Service 调用、响应格式
5. **`internal/auth/auth.go`** — 认证核心：JWT 签发/验证、密码哈希、WS 票据生成与消费
6. **`internal/service/user.go`** — 业务逻辑：注册、登录、Token 轮换（事务）
7. **`internal/ws/hub.go`** — WebSocket 核心：RoomHub goroutine、广播、慢客户端清理
8. **`internal/ws/conn.go`** — 连接管理：读写循环、心跳、消息分发
9. **`frontend/src/App.tsx`** — 前端入口：Hooks 组合、状态流转
10. **`frontend/src/hooks/useChatSocket.ts`** — WS 客户端：事件分发、typing 去抖

每一步都能在几分钟内读完，串起来就是一个完整的全栈系统。

## 快速开始

### 前置要求

- Go 1.24
- Node.js 22+
- Docker

### 本地运行

```bash
git clone https://github.com/LessUp/chatroom.git
cd chatroom

docker compose up -d postgres

# 后端
go run ./cmd/server

# 前端（另开终端）
npm --prefix frontend ci
npm --prefix frontend run dev
```

### 常用地址

| 入口 | 地址 |
|------|------|
| 前端开发服务器 | http://localhost:5173 |
| 后端 | http://localhost:8080 |
| 文档站 | https://lessup.github.io/chatroom/ |

## 文档

完整文档托管在 GitHub Pages：

- **[快速开始](https://lessup.github.io/chatroom/tutorials/local-dev)** — 几分钟启动项目
- **[系统架构](https://lessup.github.io/chatroom/architecture/system)** — 分层与组件交互
- **[数据流](https://lessup.github.io/chatroom/architecture/data-flow)** — 认证与消息流转图
- **[REST API](https://lessup.github.io/chatroom/api/rest)** — 接口参考
- **[WebSocket 协议](https://lessup.github.io/chatroom/api/websocket)** — 消息格式与心跳
- **[手动测试实验](https://lessup.github.io/chatroom/tutorials/testing)** — 10 个实验验证全部功能

## 技术概览

| 层级 | 技术 |
|------|------|
| 后端 | Go 1.24, Gin, GORM, Gorilla WebSocket, zerolog |
| 前端 | React 19, TypeScript, Vite 7, Tailwind CSS v4 |
| 数据库 | PostgreSQL 16 |
| 交付 | Docker, GitHub Actions, GitHub Pages |

## 项目结构

```text
chatroom/
├── cmd/server/        # 程序入口
├── internal/          # 后端应用代码
│   ├── auth/          # JWT、密码哈希、WebSocket 票据
│   ├── config/        # 配置加载、校验、日志
│   ├── db/            # 数据库连接、迁移、清理
│   ├── models/        # GORM 数据模型
│   ├── sanitize/      # 输入清洗（防 XSS）
│   ├── server/        # HTTP 路由、Handler、中间件
│   ├── service/       # 业务逻辑层
│   └── ws/            # WebSocket Hub、连接、消息处理
├── frontend/          # React 客户端
├── docs/              # 文档站（中文）
└── deploy/            # Docker 配置
```

## 验证命令

```bash
docker compose up -d postgres
make lint
go test -race ./...
npm --prefix frontend run test
npm --prefix frontend run build
npm --prefix docs run docs:build
```

## 许可证

[MIT License](LICENSE)
