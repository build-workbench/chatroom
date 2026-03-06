# ChatRoom

一个用于个人练手与教学的实时聊天室示例项目。

后端使用 Go、Gin、GORM 与 WebSocket，前端使用 React + TypeScript。项目目标是帮助你快速理解以下内容：

- 账号注册、登录与 JWT 鉴权
- REST API + WebSocket 的协作方式
- 房间、消息、在线人数、输入状态等聊天场景
- Go 后端测试、前端单元测试、CI 与 GitHub Release 的基础实践

## 项目定位

本项目的定位是：

- 个人练手
- 教学演示
- 开箱即可运行和观察

它不是生产项目，因此这里更强调：

- 文档真实可信
- 本地体验清晰
- 测试可以直接跑通
- 发布流程简单可理解

而不是过度追求复杂部署或生产级治理。

## 功能概览

- 用户注册 / 登录 / 刷新令牌
- 房间创建与列表获取
- WebSocket 实时消息推送
- 在线人数与加入 / 离开事件
- 输入中提示
- 消息历史分页读取
- 健康检查、版本信息、Prometheus 指标

## 界面说明

仓库里有两套前端资源：

- `frontend/`
  - React + TypeScript 主前端
  - 日常开发、测试和构建都以它为主

- `web/`
  - 静态 HTML + JavaScript 回退界面
  - 当 `frontend/dist` 不存在时，后端会自动回退到这套界面

后端启动后会优先服务 `frontend/dist`，否则回退到 `web/`。

## 技术栈

| 组件 | 技术 |
|------|------|
| 后端 | Go 1.24, Gin, GORM, gorilla/websocket |
| 前端 | React 19, TypeScript, Vite |
| 数据库 | PostgreSQL 16 |
| 日志 | Zerolog |
| 监控 | Prometheus |
| 自动化 | GitHub Actions |

## 快速开始

### 前置要求

- Go 1.24+
- Node.js 20+
- Docker 与 Docker Compose

### 方式一：本地开发（推荐）

先启动数据库：

```bash
docker compose up -d postgres
```

复制环境变量示例并按需调整：

```bash
cp .env.example .env
```

启动后端：

```bash
go run ./cmd/server
```

另开一个终端，启动 React 前端：

```bash
npm --prefix frontend ci
npm --prefix frontend run dev
```

访问地址：

- 前端开发界面：`http://localhost:5173`
- 后端健康检查：`http://localhost:8080/health`
- 后端版本信息：`http://localhost:8080/version`

### 方式二：仅运行后端 + 构建后的前端

如果你想体验更接近发布包的方式，可以先构建前端，再启动后端：

```bash
docker compose up -d postgres
npm --prefix frontend ci
npm --prefix frontend run build
go run ./cmd/server
```

此时直接访问：

- `http://localhost:8080`

### 方式三：Docker Compose

```bash
docker compose up -d
```

然后访问：

- `http://localhost:8080`

## 实际手动测试方法

下面是一套适合教学与演示的最小手测流程。

### 1. 验证服务是否启动

浏览器或命令行访问：

```bash
curl http://localhost:8080/health
curl http://localhost:8080/version
```

你应该看到健康状态与版本信息 JSON。

### 2. 注册并登录第一个用户

- 打开 `http://localhost:5173`（开发模式）或 `http://localhost:8080`（构建模式）
- 注册一个账号，例如 `alice / testpass`
- 使用该账号登录
- 登录后应能看到房间列表区域与当前用户信息

### 3. 创建房间

- 在左侧输入框中输入房间名，例如 `general`
- 点击“创建”
- 创建成功后应自动进入该房间

### 4. 验证双人实时通信

- 打开第二个浏览器窗口或无痕窗口
- 再注册并登录一个账号，例如 `bob / testpass`
- 进入同一个房间
- 在任一窗口发送消息
- 预期结果：两个窗口都能看到消息、加入/离开提示以及在线人数变化

### 5. 验证“正在输入”状态

- 两个用户同时在同一房间
- 其中一个用户开始输入但暂不发送
- 另一个用户应看到“正在输入”提示

### 6. 验证历史消息

- 在房间里先发送几条消息
- 刷新页面并重新进入该房间
- 预期结果：历史消息仍可加载

### 7. 验证后端回退静态界面

- 先删除或临时移走 `frontend/dist`
- 启动后端
- 访问 `http://localhost:8080`
- 预期结果：后端回退服务 `web/` 目录中的静态界面

## 测试与质量检查

### 后端测试

```bash
go test ./...
```

### 前端测试

```bash
npm --prefix frontend run test
```

### 前端构建

```bash
npm --prefix frontend run build
```

### 代码格式与常用命令

```bash
make test
make lint
make fmt
make build
```

## 配置项

环境变量示例见：[`/.env.example`](.env.example)

| 变量 | 默认值 | 描述 |
|------|--------|------|
| `APP_PORT` | `8080` | HTTP 端口 |
| `APP_ENV` | `dev` | 运行环境 |
| `DATABASE_DSN` | 本地 PostgreSQL 连接串 | 数据库连接 |
| `JWT_SECRET` | `dev-secret-change-me` | JWT 签名密钥 |
| `ACCESS_TOKEN_TTL_MINUTES` | `15` | Access Token 有效期 |
| `REFRESH_TOKEN_TTL_DAYS` | `7` | Refresh Token 有效期 |

## 项目结构

```text
chatroom/
├── cmd/server/          # 后端入口
├── internal/            # 后端业务代码
├── frontend/            # React 主前端
├── web/                 # 静态回退界面
├── docs/                # 设计与 API 文档
├── deploy/              # Docker / Kubernetes 相关文件
├── changelog/           # 变更记录
└── .github/workflows/   # CI / Release / Security 自动化
```

## GitHub Release

仓库已经配置 GitHub Actions 自动发布流程。

当你推送符合语义化版本的标签时，例如：

```bash
git tag v0.1.0
git push origin v0.1.0
```

Release workflow 会自动：

- 运行必要的校验
- 构建多平台后端二进制
- 构建前端静态资源
- 生成 GitHub Release 附件

发布产物会尽量保持“下载后即可本地运行”的结构。

## 教学文档站

仓库现在包含一个基于 `VitePress` 的教学型在线文档站，文档源文件直接复用 `docs/` 目录。

### 本地启动文档站

```bash
npm --prefix docs install
npm --prefix docs run docs:dev
```

默认本地预览地址通常为：

- `http://localhost:5173`

### 构建文档站

```bash
npm --prefix docs run docs:build
```

### 在线发布

- 文档站通过 `.github/workflows/docs.yml` 自动发布到 GitHub Pages
- 推送 `main` 分支中的文档改动后会自动触发构建与部署
- 首次使用时需要在仓库设置中启用 GitHub Pages

## 相关文档

- [API 文档](docs/API.md)
- [架构设计](docs/ARCHITECTURE.md)
- [系统设计](docs/DESIGN.md)
- [监控说明](docs/monitoring/README.md)
- [贡献指南](CONTRIBUTING.md)
- [变更日志](CHANGELOG.md)
- [项目路线图](PROJECT_ROADMAP.md)
- [安全策略](SECURITY.md)

## 许可证

本项目使用 [MIT License](LICENSE)。

## 最后说明

如果你想把它作为教学项目继续扩展，建议优先做这些事情：

- 增加更多业务测试和接口测试
- 补充截图或 GIF 演示
- 在 README 中补充接口调用示例
- 用 Issue / PR 模板规范练习流程

如果你想把它真正推向生产，则需要额外补足安全、部署、配置管理、审计、限流、持久化策略等能力。
