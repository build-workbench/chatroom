# ChatRoom

[![CI](https://github.com/LessUp/chatroom/actions/workflows/ci.yml/badge.svg)](https://github.com/LessUp/chatroom/actions/workflows/ci.yml)
|[![Docs](https://github.com/LessUp/chatroom/actions/workflows/pages.yml/badge.svg)](https://lessup.github.io/chatroom/)
|[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
|[![GitHub release](https://img.shields.io/github/v/release/LessUp/chatroom)](https://github.com/LessUp/chatroom/releases)

一个面向教学的实时聊天室项目，用来展示如何把 **Go**、**React**、**PostgreSQL**、**WebSocket** 和 **测试** 组合成一个可运行、可理解的全栈系统。

## 这个项目适合什么场景

这个仓库强调三件事：
- **能跑起来**：本地几分钟即可启动
- **能读懂**：后端、前端、文档各自边界清晰
- **能教学**：适合学习一个实时系统是如何组织起来的

这是一个**单实例**教学项目，不包含多副本部署、分布式同步或监控体系。如果你想找一个不臃肿、但又覆盖认证、房间、消息、WebSocket 和发布流程的全栈示例，这个项目就是为此准备的。

## 你能从这里学到什么

- JWT 登录、刷新令牌和鉴权流程
- 房间级 WebSocket 通信与消息持久化
- Go 后端的 handler / service / data model 组织方式
- React + TypeScript 聊天客户端的状态与通信结构
- Docker 多阶段构建与 GitHub Actions 发布工作流

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

## 下一步看哪里

- **文档站**：https://lessup.github.io/chatroom/
- **快速开始**：[本地开发](https://lessup.github.io/chatroom/tutorials/local-dev)
- **架构说明**：[系统架构](https://lessup.github.io/chatroom/architecture/system)
- **API 参考**：[REST API](https://lessup.github.io/chatroom/api/rest)
- **版本历史**：[`CHANGELOG.md`](CHANGELOG.md)

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
