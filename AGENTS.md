# 仓库协作指南

## 项目结构与模块划分
`cmd/server/main.go` 负责加载配置、初始化日志、连接数据库并启动 HTTP / WebSocket 服务。核心业务代码位于 `internal/*`：`auth` 负责令牌与鉴权，`db` 负责数据库连接与迁移，`models` 定义共享数据结构，`mw` 存放 HTTP 中间件，`ws` 维护 Hub 与连接状态，`metrics` 提供观测指标。默认配置在 `internal/config/config.go`。前端以 `frontend/` 为主，`web/` 是后端在 `frontend/dist` 不存在时使用的静态回退界面。测试文件应与被测包放在一起，例如 `internal/ws/hub_test.go`，以便 `go test ./...` 直接发现。

## 项目定位
本仓库主要用于个人练手与教学演示，不以生产部署为目标。提交改动时优先保证：

- 文档与代码行为一致
- 本地运行路径清晰
- 测试和构建能直接通过
- 设计简单、便于理解和讲解

避免为了“看起来更工程化”而引入超出当前项目目标的复杂度。

## 构建、测试与开发命令
- `docker compose up -d postgres`：启动 `docker-compose.yml` 中定义的 PostgreSQL 16 服务。
- `go run ./cmd/server`：在本地数据库上运行后端 API / WebSocket 服务。
- `go build ./cmd/server`：构建后端二进制；需要打包时可配合 `-o bin/chatroom` 使用。
- `go test ./...`：运行全部 Go 测试。
- `npm --prefix frontend run test`：运行前端单元测试。
- `npm --prefix frontend run build`：构建 React 前端。

## 代码风格与命名约定
Go 代码统一使用 `gofmt ./...` 格式化，保持短小、全小写的包名，并与目录名称一致。导出标识符使用 `CamelCase`，内部辅助函数使用 `camelCase`，JSON 标签保持 `snake_case` 以匹配接口载荷。共享 DTO 放在 `internal/models`，配置结构放在 `internal/config`。前端文件名保持清晰，React 组件放在 `frontend/src`，静态回退资源放在 `web/`。

## 测试约定
优先使用表驱动测试，并让测试包名与被测包保持一致，例如 `package ws`。数据库相关测试应尽量保持本地可运行、低依赖；WebSocket 测试应覆盖广播、在线人数和房间隔离等关键行为。提交前至少确认：`go test ./...`、`npm --prefix frontend run test`、`npm --prefix frontend run build` 可以通过。若存在有意保留的测试空白，请在提交说明中明确写出原因。

## 提交与 Pull Request 建议
提交标题建议使用祈使句并控制在约 50 个字符内，必要时补充正文说明背景、影响范围和验证方式。若有关联问题，可使用 `Refs #123`。Pull Request 建议包含：改动背景、测试证据、手动验证步骤，以及对文档 / 配置 / Release 的影响说明。

## 安全与配置提示
运行时配置统一从 `internal/config` 读取，可通过 `APP_PORT`、`DATABASE_DSN`、`JWT_SECRET`、`APP_ENV`、`ACCESS_TOKEN_TTL_MINUTES`、`REFRESH_TOKEN_TTL_DAYS`、`LOG_LEVEL`、`LOG_FORMAT` 覆盖。真实密钥不要提交到仓库；教学环境可以使用默认值，但在非 `dev` 环境下应显式设置 `JWT_SECRET`。日志通过 `LOG_LEVEL`（trace/debug/info/warn/error/fatal）和 `LOG_FORMAT`（console/json）控制，建议保持结构化输出，并避免在 WebSocket 或鉴权逻辑中直接记录敏感用户输入。
