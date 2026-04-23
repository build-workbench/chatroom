# ChatRoom

[![CI](https://github.com/LessUp/chatroom/actions/workflows/ci.yml/badge.svg)](https://github.com/LessUp/chatroom/actions/workflows/ci.yml)
[![Docs](https://github.com/LessUp/chatroom/actions/workflows/pages.yml/badge.svg)](https://lessup.github.io/chatroom/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub release](https://img.shields.io/github/v/release/LessUp/chatroom)](https://github.com/LessUp/chatroom/releases)

[English](README.md) | 简体中文

一个面向教学的实时聊天室项目，用来展示如何把 **Go**、**React**、**PostgreSQL**、**WebSocket**、**测试**、**可观测性** 和 **OpenSpec 驱动变更管理** 组合成一个可运行、可理解的全栈系统。

## 这个项目适合什么场景

这个仓库强调三件事：
- **能跑起来**：本地几分钟即可启动
- **能读懂**：后端、前端、文档、规约各自边界清晰
- **能教学**：适合学习一个实时系统是如何组织起来的

如果你想找一个不臃肿、但又覆盖认证、房间、消息、WebSocket、监控和发布流程的全栈示例，这个项目就是为此准备的。

## 你能从这里学到什么

- JWT 登录、刷新令牌和鉴权流程
- 房间级 WebSocket 通信与消息持久化
- Go 后端的 handler / service / data model 组织方式
- React + TypeScript 聊天客户端的状态与通信结构
- Prometheus 指标、健康检查、发布工作流
- 如何用 OpenSpec 保持需求、设计与实现一致

## 快速开始

### 前置要求

- Go 1.24
- Node.js 22
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

- **文档站**：[English](https://lessup.github.io/chatroom/en/) · [中文](https://lessup.github.io/chatroom/zh/)
- **快速开始**：[EN](https://lessup.github.io/chatroom/en/getting-started) · [ZH](https://lessup.github.io/chatroom/zh/getting-started)
- **架构说明**：[EN](https://lessup.github.io/chatroom/en/architecture) · [ZH](https://lessup.github.io/chatroom/zh/architecture)
- **API 参考**：[EN](https://lessup.github.io/chatroom/en/api) · [ZH](https://lessup.github.io/chatroom/zh/api)
- **OpenSpec 规约**：[`openspec/specs/`](openspec/specs)

## 技术概览

| 层级 | 技术 |
|------|------|
| 后端 | Go 1.24, Gin, GORM, Gorilla WebSocket, zerolog |
| 前端 | React 19, TypeScript, Vite 7, Tailwind CSS v4 |
| 数据库 | PostgreSQL 16 |
| 可观测性 | Prometheus, Grafana |
| 交付 | Docker, GitHub Actions, GitHub Pages |

## 项目结构

```text
chatroom/
├── cmd/server/        # 程序入口
├── internal/          # 后端应用代码
├── frontend/          # React 客户端
├── web/               # 静态回退 UI
├── docs/              # 文档站
├── openspec/          # 规约与变更
└── deploy/            # Docker / Kubernetes 配置
```

## OpenSpec 工作流

非平凡变更通过 OpenSpec 管理：

```bash
/opsx:explore
/opsx:propose <change-name>
/opsx:apply <change-name>
/opsx:archive <change-name>
```

规范定义位于 [`openspec/specs/`](openspec/specs)，进行中的变更位于 [`openspec/changes/`](openspec/changes)。

## 验证命令

```bash
docker compose up -d postgres
make lint
go test -race ./...
npm --prefix frontend run test
npm --prefix frontend run build
npm --prefix docs ci
npm --prefix docs run docs:build
```

## 贡献与安全

- 贡献指南：[CONTRIBUTING.md](CONTRIBUTING.md)
- 安全策略：[SECURITY.md](SECURITY.md)
- 版本历史：[CHANGELOG.md](CHANGELOG.md)

## 许可证

[MIT License](LICENSE)
