# ChatRoom

[![CI](https://github.com/LessUp/chatroom/actions/workflows/ci.yml/badge.svg)](https://github.com/LessUp/chatroom/actions/workflows/ci.yml)
[![Docs](https://github.com/LessUp/chatroom/actions/workflows/pages.yml/badge.svg)](https://lessup.github.io/chatroom/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[English](README.md) | 简体中文

一个面向个人练手与教学演示的实时聊天室项目，使用 Go、React、PostgreSQL、REST API 与 WebSocket 构建。

**设计哲学**：可运行、可理解、可验证、可扩展 —— 不追求功能堆砌。

## 核心特性

- **认证系统**：JWT + Refresh Token，支持自动刷新与轮换
- **实时通信**：WebSocket 房间广播，支持分布式部署
- **在线状态**：在线人数、加入/离开事件、输入提示
- **消息历史**：游标分页，支持加载更多
- **安全防护**：速率限制、CORS 校验、输入验证
- **可观测性**：Prometheus 指标、结构化日志、健康检查
- **部署支持**：Docker、Kubernetes 清单、GitHub Actions CI/CD

## 快速开始

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
| 健康检查 | http://localhost:8080/health |
| 就绪检查 | http://localhost:8080/ready |
| 版本信息 | http://localhost:8080/version |
| Prometheus 指标 | http://localhost:8080/metrics |

## 技术栈

| 层级 | 技术 |
|------|------|
| 后端 | Go 1.24, Gin, GORM, gorilla/websocket, zerolog |
| 前端 | React 19, TypeScript, Vite 7, Tailwind CSS v4 |
| 数据库 | PostgreSQL 16 |
| 监控 | Prometheus, Grafana |
| 部署 | Docker, Kubernetes |

## 项目结构

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
└── .github/workflows/       # CI/CD 流水线
```

## 配置说明

后端直接读取**进程环境变量**，不会自动加载 `.env` 文件。

主要配置项：

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

## 常用命令

```bash
# Go
make test          # 运行测试
make lint          # 代码检查
make build         # 构建
make all           # lint + test + build

# 前端
npm --prefix frontend run dev     # 开发服务器
npm --prefix frontend run build   # 构建
npm --prefix frontend run test    # 测试

# Docker
docker compose up -d              # 启动所有服务
docker compose up -d postgres     # 仅数据库
```

## 文档

- 📖 [文档站](https://lessup.github.io/chatroom/)
- 🚀 [快速开始](docs/getting-started.md)
- 📚 [API 文档](docs/API.md)
- 🏗️ [架构文档](docs/ARCHITECTURE.md)
- 🎨 [设计文档](docs/DESIGN.md)
- ❓ [常见问题](docs/FAQ.md)

## 贡献

贡献指南见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 安全

安全策略与最佳实践见 [SECURITY.md](SECURITY.md)。

## 许可证

[MIT License](LICENSE)
