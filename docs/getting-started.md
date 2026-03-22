# 快速开始

这份页面的目标不是把所有细节一次讲完，而是让你先把项目跑起来，再进入后续教学章节。

## 项目定位

ChatRoom 是一个用于个人练手和教学演示的实时聊天室。

它优先保证：

- 本地可以快速运行
- 文档和代码行为一致
- 测试与构建可直接验证
- 结构清晰，便于讲解

## 先理解整体结构

仓库里有两套前端：

- `frontend/`
  - React 主前端
  - 日常开发、测试、构建都以它为主

- `web/`
  - 静态回退界面
  - 当 `frontend/dist` 不存在时，由后端直接托管

后端会优先服务 `frontend/dist`；如果构建产物不存在，则回退到 `web/`。

后端代码主要在：

- `cmd/server/`
- `internal/config/`
- `internal/server/`
- `internal/service/`
- `internal/ws/`

## 前置要求

- Go 1.24+
- Node.js 20+
- Docker 与 Docker Compose

## 推荐启动方式

### 1. 启动数据库

```bash
docker compose up -d postgres
```

### 2. 了解配置来源

项目后端直接读取进程环境变量。仓库根目录中的 `.env.example` 是配置模板与说明清单，但 `go run ./cmd/server` **不会自动加载** `.env` 文件。

这意味着：

- 你可以把 `.env.example` 当作配置参考
- 也可以在 Docker / Compose / CI / 部署平台中按同名环境变量注入配置
- 开发环境下，大多数配置已有默认值；生产相关参数不能依赖默认值

### 3. 启动后端

```bash
go run ./cmd/server
```

### 4. 启动前端开发服务器

```bash
npm --prefix frontend ci
npm --prefix frontend run dev
```

### 5. 打开页面

- 前端开发页：`http://localhost:5173`
- 健康检查：`http://localhost:8080/health`
- 就绪检查：`http://localhost:8080/ready`
- 兼容健康检查：`http://localhost:8080/healthz`
- 版本信息：`http://localhost:8080/version`
- 指标端点：`http://localhost:8080/metrics`

## 如果你想模拟发布包运行方式

你也可以先构建前端，再让后端托管构建产物：

```bash
docker compose up -d postgres
npm --prefix frontend ci
npm --prefix frontend run build
go run ./cmd/server
```

然后访问：

- `http://localhost:8080`

## 生产部署前你至少要关注什么

最少需要确认下面这些配置：

- `JWT_SECRET`：非 `dev` 环境必须替换默认值
- `DATABASE_DSN`：指向真实数据库
- `ALLOWED_ORIGINS`：非 `dev` 环境下用于 CORS 与 WebSocket 来源校验

`ALLOWED_ORIGINS` 的书写规则：

- 必须是完整 origin，例如 `https://chat.example.com`
- 可带端口，例如 `https://app.example.com:8443`
- 多个值用逗号分隔
- 不能带 path、query、fragment

## 推荐学习路径

### 第一阶段：能跑

- 先跑通项目
- 访问健康检查接口
- 完成一次注册、登录和发消息

### 第二阶段：能看懂

- 阅读 [API 文档](/API)
- 阅读 [架构文档](/ARCHITECTURE)
- 阅读 [设计文档](/DESIGN)

### 第三阶段：能验证

- 按 [手动测试实验](/manual-testing) 逐项操作
- 跑后端和前端测试
- 观察日志、数据库和 WebSocket 行为

## 常用命令

```bash
go test ./...
npm --prefix frontend run test
npm --prefix frontend run build
npm --prefix docs ci
npm --prefix docs run docs:build
make lint
make fmt
```
