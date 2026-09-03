# ChatRoom

[![CI](https://github.com/build-workbench/chatroom/actions/workflows/ci.yml/badge.svg)](https://github.com/build-workbench/chatroom/actions/workflows/ci.yml)
[![Docs](https://github.com/build-workbench/chatroom/actions/workflows/pages.yml/badge.svg)](https://build-workbench.github.io/chatroom/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

业余练手写的一个轻量全栈实时聊天室，用来串联熟悉 **Go + React + WebSocket + PostgreSQL** 的完整开发链路。

项目追求清晰可读与开箱即跑，采用轻量单实例架构，摒弃过度设计与复杂中间件，重点把**用户认证、WebSocket 长连接广播、在线状态同步与工程化打包**这套核心链路打通走顺。

## 界面预览

![聊天室界面 — 浅色精美主题](docs/public/screenshots/chatroom.png)

*浅色精美主题：左侧房间列表与在线人数，右侧消息流与输入区 · 雾蓝留白、柔和阴影、圆角卡片，轻盈通透适合长时间阅读与演示*

## 功能亮点

- 🔐 **双 Token 认证**：JWT Access Token + Refresh Token 自动轮换，密码 bcrypt 哈希，WebSocket 一次性 Ticket 认证握手。
- 💬 **实时长连接**：基于 Go 原生 Goroutine + Channel 的房间级 Hub 广播模型，支持心跳保活与慢客户端自动剔除。
- ⚡ **状态感知**：房间列表实时在线人数感知、消息实时推送、用户输入中（Typing）去抖提示。
- 🎨 **现代化前端**：React 19 + TypeScript + Vite 7 + Tailwind CSS v4，现代化浅色卡片 UI，内置友好 Toast 提示。
- 🧪 **开箱即测**：后端测试自带 SQLite 内存库（免启动外部数据库）、前端单元测试完备、Docker 多阶段统一打包。

## 技术栈

| 层次 | 技术选型 | 说明 |
|------|----------|------|
| **后端** | Go 1.24, Gin, GORM, Gorilla WebSocket | 分层结构，Handler / Service / Model 职责分离 |
| **前端** | React 19, TypeScript, Vite 7, Tailwind CSS v4 | 原生 Hooks 状态管理，Axios 自动刷新 Token 拦截 |
| **数据库** | PostgreSQL 16 | 运行期持久化存储（测试环境自动切换为 SQLite 内存库） |
| **容器化** | Docker, Docker Compose | 支持前后端独立热重载开发，也支持一键全栈运行 |

## 快速开始

### 前置要求

- **Go** 1.24+
- **Node.js** 22+
- **Docker** & **Docker Compose**

### 方式一：本地开发运行（推荐）

```bash
# 1. 启动 PostgreSQL 数据库
docker compose up -d postgres

# 2. 启动 Go 后端（监听 :8080）
go run ./cmd/server

# 3. 启动前端开发服务器（另开终端，监听 :5173）
npm --prefix frontend ci
npm --prefix frontend run dev
```

### 方式二：Docker 一键运行

无需本地安装 Go 和 Node.js 环境，直接构建并启动整套全栈服务：

```bash
# 构建并启动全部服务
docker compose up -d

# 停止服务
docker compose down
```

启动后直接访问 `http://localhost:8080`。

### 访问地址

| 服务 | 地址 | 说明 |
|------|------|------|
| 前端页面（本地开发） | http://localhost:5173 | 支持热更新，自动代理后端 API 与 WebSocket |
| 后端服务 / Docker 页面 | http://localhost:8080 | 提供 REST API、WebSocket 及生产静态页面 |
| 完整文档站 | https://build-workbench.github.io/chatroom/ | 架构设计、接口参考与实验指南 |

## 常用命令

```bash
# 测试
go test -race ./...              # 后端单元与集成测试（使用内存 SQLite，无需启动 Docker）
npm --prefix frontend run test  # 前端测试

# 代码检查与打包
make lint                       # 后端代码检查（golangci-lint）
npm --prefix frontend run build # 前端生产打包
```

## 文档与协议

- 📖 **[完整文档](https://build-workbench.github.io/chatroom/)**：包含架构设计、REST API、WebSocket 协议及详细实验指南。
- 📄 **[开源协议](LICENSE)**：MIT License
