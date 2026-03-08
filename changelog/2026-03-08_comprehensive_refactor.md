# 2026-03-08 全面代码重构与优化

## 后端

### 配置与日志系统升级
- `internal/config/config.go` 新增 `LogLevel`、`LogFormat` 配置字段
- 新增 `IsDev()` 便捷方法替代散落各处的 `cfg.Env == "dev"` 比较
- 提取 `getenvInt()` 辅助函数消除整数解析重复代码
- `Validate()` 新增 `LOG_LEVEL` 合法性校验
- `internal/log/logger.go` 重构为接收完整 `Config` 结构体，支持可配置日志级别和输出格式

### 数据模型优化
- `internal/models/models.go` 为所有模型字段添加 `json` 标签（`snake_case` 风格）
- 敏感字段（`PasswordHash`、`Token`）使用 `json:"-"` 防止序列化泄露
- 所有模型新增显式 `TableName()` 方法确保表名一致性

### WebSocket 层重构
- `internal/ws/hub.go` 提取 `broadcastToClients()`、`broadcastEvent()`、`updateOnline()` 三个辅助方法，消除三处重复的广播循环逻辑
- `unregister` 分支改用 early-break 减少嵌套层次
- `internal/ws/conn.go` 提取 6 个命名常量替代硬编码魔法数字：`maxMessageSize`、`maxContentLength`、`pongWait`、`pingInterval`、`writeWait`、`sendBufSize`
- `SetReadDeadline`/`SetWriteDeadline` 返回值不再被静默忽略

### HTTP Handler 优化
- `internal/server/handler.go` 提取 4 个请求结构体到顶层，使用 Gin `binding` 验证标签（`required`、`min`、`max`）
- 新增 `badRequest()`、`serverError()` 统一错误响应辅助函数
- `ListMessages` 参数解析逻辑简化

### 数据库连接优化
- `internal/db/db.go` 提取连接池常量（`maxRetries`、`maxIdleConns`、`maxOpenConns` 等）
- 连接重试过程增加结构化日志输出（包含尝试次数和延迟时间）
- 使用 Go 1.22+ `range` 整数循环

## 前端

### 代码风格修复
- `frontend/src/socket.ts` 修复 class 属性和 `reconnect()` 方法中混合 tab/space 缩进，统一为 2-space

## 工具链与 CI/CD

### Linter 更新
- `.golangci.yml` 移除已废弃的 `exportloopref`（Go 1.22+ 不再需要）
- 新增 `copyloopvar` 和 `intrange` 两个现代 linter

### CI Workflows
- `ci.yml`：golangci-lint-action 升级到 v6，docker/build-push-action 升级到 v6
- `release.yml`：docker/build-push-action 升级到 v6，softprops/action-gh-release 升级到 v2

### Docker / Compose
- `deploy/docker/Dockerfile` 改为 3 阶段构建（前端 → 后端 → 运行时），自动构建 React 前端
- 运行时基础镜像升级到 Alpine 3.21，合并 RUN 指令减少层数
- `docker-compose.yml` Prometheus 升级到 v2.53.0，Grafana 升级到 11.3.0

### 其他
- `.gitignore` 保留 `.env.example`、新增 `.windsurf/` 和 `Thumbs.db` 忽略规则

## 文档

- `CHANGELOG.md` 新增 v0.2.0 版本条目，详细记录全部变更
- `README.md` 配置项表格新增 `LOG_LEVEL` 和 `LOG_FORMAT` 说明
- `SECURITY.md` 更新支持版本表格为实际版本号（0.1.x、0.2.x）
- `AGENTS.md` 安全与配置提示部分新增 `LOG_LEVEL`、`LOG_FORMAT` 环境变量说明
