# ChatRoom

[![CI](https://github.com/LessUp/chatroom/actions/workflows/ci.yml/badge.svg)](https://github.com/LessUp/chatroom/actions/workflows/ci.yml)
[![Docs](https://github.com/LessUp/chatroom/actions/workflows/pages.yml/badge.svg)](https://lessup.github.io/chatroom/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub release](https://img.shields.io/github/v/release/LessUp/chatroom)](https://github.com/LessUp/chatroom/releases)

[English](README.md) | 简体中文

一个面向个人练手与教学演示的实时聊天室项目，使用 Go、React、PostgreSQL、REST API 与 WebSocket 构建。

**设计哲学**：可运行、可理解、可验证、可扩展 —— 不追求功能堆砌。

## 🚀 快速开始

### 前置要求

- Go 1.24+
- Node.js 20+
- Docker & Docker Compose

### 本地运行

```bash
# 1. 启动数据库
docker compose up -d postgres

# 2. 启动后端（终端 1）
go run ./cmd/server

# 3. 启动前端（终端 2）
npm --prefix frontend ci
npm --prefix frontend run dev
```

### 访问地址

| 服务 | 地址 |
|------|------|
| 前端开发服务器 | http://localhost:5173 |
| 后端首页 | http://localhost:8080 |

## ✨ 核心特性

- **认证系统**：JWT + Refresh Token，支持自动刷新与轮换
- **实时通信**：WebSocket 房间广播，支持分布式部署
- **在线状态**：在线人数、加入/离开事件、输入提示
- **消息历史**：游标分页，支持加载更多
- **安全防护**：速率限制、CORS 校验、输入验证
- **可观测性**：Prometheus 指标、结构化日志、健康检查
- **部署支持**：Docker、Kubernetes 清单、GitHub Actions CI/CD

## 🏗️ 架构

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   React     │────▶│   Go Gin    │────▶│ PostgreSQL  │
│   前端      │◀────│   后端      │◀────│   数据库    │
└─────────────┘ WS  └─────────────┘     └─────────────┘
```

## 📚 文档

- 📖 [文档站（英文）](https://lessup.github.io/chatroom/en/)
- 📖 [文档站（中文）](https://lessup.github.io/chatroom/zh/)
- 🚀 [快速开始](https://lessup.github.io/chatroom/zh/getting-started)
- 📚 [API 文档](https://lessup.github.io/chatroom/zh/api)
- 🏗️ [架构文档](https://lessup.github.io/chatroom/zh/architecture)
- 🎨 [设计文档](https://lessup.github.io/chatroom/zh/design)
- ❓ [常见问题](https://lessup.github.io/chatroom/zh/faq)

## 🛠️ 技术栈

| 层级 | 技术 |
|------|------|
| 后端 | Go 1.24, Gin, GORM, gorilla/websocket, zerolog |
| 前端 | React 19, TypeScript, Vite 7, Tailwind CSS v4 |
| 数据库 | PostgreSQL 16 |
| 监控 | Prometheus, Grafana |
| 部署 | Docker, Kubernetes |

## 📁 项目结构

```
chatroom/
├── cmd/server/              # 程序入口
├── internal/                # 内部包
│   ├── auth/                # JWT、密码、Token
│   ├── config/              # 配置管理
│   ├── db/                  # 数据库连接、迁移
│   ├── server/              # HTTP 路由与 Handler
│   ├── service/             # 业务逻辑层
│   ├── ws/                  # WebSocket Hub 与连接
│   ├── mw/                  # 中间件（认证、限流、CORS）
│   ├── metrics/             # Prometheus 指标
│   └── models/              # GORM 数据模型
├── frontend/                # React 前端
├── web/                     # 静态回退 UI
├── docs/                    # VitePress 文档站
├── deploy/                  # Docker、Kubernetes 配置
└── changelog/               # 细粒度变更记录
```

## ⚙️ 配置

配置从**环境变量**读取：

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `APP_PORT` | 8080 | HTTP 端口 |
| `APP_ENV` | dev | 运行环境 |
| `DATABASE_DSN` | 本地连接串 | PostgreSQL 连接配置 |
| `JWT_SECRET` | dev-secret-change-me | JWT 密钥（生产必须修改） |
| `ALLOWED_ORIGINS` | 空 | CORS 允许的来源 |
| `ACCESS_TOKEN_TTL_MINUTES` | 15 | Access Token 有效期 |
| `REFRESH_TOKEN_TTL_DAYS` | 7 | Refresh Token 有效期 |

完整配置见 `.env.example`。

## 🧪 测试

```bash
# Go 测试
make test

# 前端测试
npm --prefix frontend run test

# 完整验证
make all
```

## 🐳 Docker

```bash
# 启动全部服务
docker compose up -d

# 包含监控
docker compose --profile monitoring up -d
```

## 📄 变更日志

版本历史见 [CHANGELOG.md](CHANGELOG.md)。

## 🤝 贡献

贡献指南见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 🔒 安全

安全策略与最佳实践见 [SECURITY.md](SECURITY.md)。

## 📜 许可证

[MIT License](LICENSE)

---

**说明**：本项目主要用于教学和练手目的。虽然包含了生产就绪的实践，但设计目标是便于学习理解，而非功能堆砌。
