# ChatRoom

[![CI](https://github.com/LessUp/chatroom/actions/workflows/ci.yml/badge.svg)](https://github.com/LessUp/chatroom/actions/workflows/ci.yml)
[![Docs](https://github.com/LessUp/chatroom/actions/workflows/pages.yml/badge.svg)](https://lessup.github.io/chatroom/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[English](README.md) | 简体中文

一个面向个人练手与教学演示的实时聊天室项目，使用 Go、React、PostgreSQL、REST API 与 WebSocket 构建。

它不是以“功能越多越好”为目标的 IM 产品，而是一个强调**可运行、可理解、可验证、可继续扩展**的教学型工程样板。

## 你能从这个仓库学到什么

- Go 后端如何组织 Gin 路由、中间件、服务层与数据库访问
- JWT + Refresh Token 的基础鉴权流程
- REST API 与 WebSocket 如何协作完成实时聊天
- React 前端如何管理登录态、房间、消息与连接状态
- 一个小项目如何逐步配齐测试、文档、CI、Release、Compose 与 Kubernetes 清单

## 核心能力

- 用户注册 / 登录 / 刷新令牌
- 房间创建与房间列表
- 历史消息分页读取
- WebSocket 实时消息、加入 / 离开事件、在线人数、输入中提示
- `frontend/` React 主前端 + `web/` 静态回退界面
- 健康检查、就绪检查、版本信息、Prometheus 指标
- Docker Compose、Kubernetes 清单、GitHub Release、GitHub Pages 文档站

## 运行模式总览

| 模式 | 实际运行内容 | 访问地址 | 适用场景 |
|------|--------------|----------|----------|
| 本地开发模式 | Go 后端 + Vite 开发服务器 | `http://localhost:5173` | 日常开发与调试 |
| 构建产物模式 | Go 后端托管 `frontend/dist` | `http://localhost:8080` | 更接近发布包的运行方式 |
| 静态回退模式 | Go 后端托管 `web/` | `http://localhost:8080` | `frontend/dist` 不存在时的演示方式 |
| Docker Compose 模式 | PostgreSQL + 应用容器 | `http://localhost:8080` | 快速体验完整本地环境 |

后端会优先服务 `frontend/dist`。如果构建产物不存在，会自动回退到 `web/`。

## 快速开始

### 前置要求

- Go 1.24+
- Node.js 20+
- Docker 与 Docker Compose

### 推荐路径：本地开发模式

#### 1. 启动数据库

```bash
docker compose up -d postgres
```

#### 2. 了解配置来源

项目后端直接读取**进程环境变量**。仓库中的 [`.env.example`](.env.example) 是配置模板与说明清单，但 `go run ./cmd/server` **不会自动加载** `.env` 文件。

这意味着：

- 你可以把 `.env.example` 当作配置参考
- 也可以在 Docker / Compose / CI / 部署平台中按同名环境变量注入配置
- 开发环境下，大多数参数已有默认值；生产相关参数不能依赖默认值

#### 3. 启动后端

```bash
go run ./cmd/server
```

#### 4. 启动 React 前端

```bash
npm --prefix frontend ci
npm --prefix frontend run dev
```

#### 5. 打开页面

- 前端开发页：`http://localhost:5173`
- 后端首页（构建产物模式 / 回退模式）：`http://localhost:8080`
- 健康检查：`http://localhost:8080/health`
- 就绪检查：`http://localhost:8080/ready`
- 兼容健康检查：`http://localhost:8080/healthz`
- 版本信息：`http://localhost:8080/version`
- Prometheus 指标：`http://localhost:8080/metrics`

### 如果你想模拟发布包运行方式

```bash
docker compose up -d postgres
npm --prefix frontend ci
npm --prefix frontend run build
go run ./cmd/server
```

然后访问：

- `http://localhost:8080`

### Docker Compose 方式

```bash
docker compose up -d
```

然后访问：

- `http://localhost:8080`

如果你还想同时启用监控组件：

```bash
docker compose --profile monitoring up -d
```

## 核心能力与接口边界

### 认证

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`

认证模型为：

- Access Token：JWT
- Refresh Token：数据库持久化并支持轮换刷新
- 前端在 REST 请求遇到 401 时会尝试自动刷新令牌
- WebSocket 同样受鉴权保护

### 聊天功能

- `POST /api/v1/rooms`
- `GET /api/v1/rooms`
- `GET /api/v1/rooms/:id/messages`
- `GET /ws`

其中：

- REST API 负责注册、登录、查房间、查历史消息
- WebSocket 负责实时消息、在线状态与输入事件
- 房间级 Hub 负责广播与在线人数维护

## 配置说明

环境变量清单见 [`.env.example`](.env.example)。下面列出最常用、最需要关注的项：

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `APP_PORT` | `8080` | HTTP 监听端口 |
| `APP_ENV` | `dev` | 运行环境 |
| `DATABASE_DSN` | 本地 PostgreSQL 连接串 | 数据库连接配置 |
| `JWT_SECRET` | `dev-secret-change-me` | JWT 签名密钥，非 `dev` 环境必须修改 |
| `ALLOWED_ORIGINS` | 空 | 允许的前端来源列表，多个值用逗号分隔 |
| `ACCESS_TOKEN_TTL_MINUTES` | `15` | Access Token 有效期（分钟） |
| `REFRESH_TOKEN_TTL_DAYS` | `7` | Refresh Token 有效期（天） |
| `LOG_LEVEL` | `info` | 日志级别 |
| `LOG_FORMAT` | `console` | 日志格式（`console` / `json`） |

### 关于 `ALLOWED_ORIGINS`

这项配置对生产环境尤其重要：

- `APP_ENV=dev` 时，来源校验相对宽松
- 非 `dev` 环境下，HTTP CORS 与 WebSocket 升级都会校验来源
- 未命中允许列表时，仅允许严格同源请求

书写规则：

- 必须是完整 origin，例如 `https://chat.example.com`
- 可带端口，例如 `https://app.example.com:8443`
- 不能带 path、query、fragment
- 多个值用逗号分隔

示例：

```env
ALLOWED_ORIGINS=https://chat.example.com,https://app.example.com:8443
```

## 部署与交付能力

仓库已经提供以下交付路径：

- [Docker Compose](docker-compose.yml)：快速起数据库、应用与可选监控
- [Dockerfile](deploy/docker/Dockerfile)：三阶段构建镜像
- [Kubernetes 清单](deploy/k8s/README.md)：Deployment、Service、Ingress、HPA 等示例
- [GitHub Release workflow](.github/workflows/release.yml)：多平台构建与发布包生成
- [GitHub Pages workflow](.github/workflows/pages.yml)：文档站自动构建与发布

## 最小验证清单

如果你想快速确认项目主链路正常，建议至少验证下面 5 步：

1. 访问 `/health`、`/ready`、`/version`
2. 注册并登录一个用户
3. 创建房间并进入房间
4. 用两个浏览器窗口验证实时消息、在线人数、加入 / 离开事件与输入中提示
5. 刷新页面并重新进入房间，确认历史消息仍可加载

更详细的实验步骤见：[手动测试实验](docs/manual-testing.md)

## 常用命令

```bash
make dev
make db
make test
make test-coverage
make lint
make fmt
make build
npm --prefix frontend run test
npm --prefix frontend run build
npm --prefix docs ci
npm --prefix docs run docs:build
```

## 进一步阅读

- [教学文档首页](docs/index.md)
- [快速开始](docs/getting-started.md)
- [手动测试实验](docs/manual-testing.md)
- [API 文档](docs/API.md)
- [架构文档](docs/ARCHITECTURE.md)
- [设计文档](docs/DESIGN.md)
- [监控说明](docs/monitoring/README.md)
- [常见问题](docs/FAQ.md)
- [贡献指南](CONTRIBUTING.md)
- [安全策略](SECURITY.md)
- [项目路线图](PROJECT_ROADMAP.md)
- [变更日志](CHANGELOG.md)

## 项目结构

```text
chatroom/
├── cmd/server/          # 后端入口
├── internal/            # 配置、服务层、中间件、WebSocket、监控等核心代码
├── frontend/            # React 主前端
├── web/                 # 静态回退界面
├── docs/                # VitePress 教学文档站
├── deploy/              # Docker / Kubernetes 相关文件
├── changelog/           # 细粒度变更记录
└── .github/workflows/   # CI / Release / Security / Docs 自动化
```

## 项目边界说明

这个项目的重点是教学与练手，所以它优先保证：

- 文档真实可信
- 本地体验清晰
- 核心链路可验证
- 工程化能力足够演示与扩展

如果你想把它继续推向更强的生产使用场景，仍然需要进一步补足更细致的安全治理、配置管理、审计、告警、多实例扩展与运维策略。

## 许可证

本项目使用 [MIT License](LICENSE)。
