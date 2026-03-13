# 发布就绪收口与安全加固

日期：2026-03-13

## 本次修复

### 后端发布阻断项

- 收紧 `internal/mw/cors.go` 的跨域策略，不再使用 `strings.Contains(origin, host)` 模糊匹配。
- 在 `internal/config/config.go` 中新增 `ALLOWED_ORIGINS` 配置解析、来源规范化、同源判断与基于 `X-Forwarded-Proto` / `Forwarded` 的公开 origin 还原逻辑。
- 在 `internal/ws/conn.go` 中让 WebSocket 升级复用同一套来源校验规则，使 HTTP CORS 与 WebSocket 行为一致。
- 更新 `.env.example` 与 `deploy/k8s/configmap.yaml`，明确生产环境可配置的 `ALLOWED_ORIGINS`。
- 补充 `internal/config/config_test.go` 与 `internal/server/router_test.go`，覆盖 allowlist、严格同源、错误 origin 与 SPA 路由回退场景。

### 前端发布体验收口

- `frontend/src/api.ts` 保留状态码与后端错误信息，同时避免刷新 token 网络失败时抛出不可解释错误。
- `frontend/src/hooks/useAuth.ts` 细化登录/注册失败提示，补充频率限制、服务异常等反馈，并稳定 token/runtime 同步逻辑。
- `frontend/src/hooks/useChat.ts` 细化房间列表、创建房间、历史消息与分页加载错误提示；断线发送时明确提示消息进入发送队列。
- `frontend/src/socket.ts` 改进 WebSocket 失败反馈、超时重连提示、重连上限提示，以及切房时旧连接事件污染问题。
- `frontend/src/hooks/useChatSocket.ts` 为重复 WebSocket 错误增加去重，避免短时间内 toast 轰炸。
- `frontend/src/screens/AuthScreen.tsx` 补齐用户名/密码长度提示与注册后引导文案。

### 发布形态修复

- `internal/server/router.go` 新增 `resolveAppRoot()`，优先查找可用的 `frontend/dist`，找不到时回退到 `web/`，减少因工作目录差异导致的静态托管失效。
- 补充 `serveApp` 路由测试，确认保留 `/api`、`/health`、`/ready`、`/metrics`、`/ws` 等保留路径，不会被 SPA 回退吞掉。

## 验证结果

### 已完成自动化验证

- `go test -race -coverprofile=coverage.out -covermode=atomic ./...`
- `go test ./internal/config ./internal/server ./internal/ws`
- `go build -ldflags="-s -w" -o bin/chatroom ./cmd/server`
- `npm --prefix frontend run test`
- `npm --prefix frontend run lint`
- `npx --prefix frontend tsc --noEmit`
- `npm --prefix frontend run build`

### 当前结果

- 后端测试通过，`internal/server` 覆盖率提升到 50.0%，`internal/config` 覆盖率 77.1%。
- 前端测试、lint、typecheck、build 均通过。
- 前端 lint 仍有一条外部依赖提示：`baseline-browser-mapping` 数据超过两个月，当前不阻断构建与发布。

## 未完成的受限验证

以下验证在当前环境未执行，不是代码失败，而是运行环境受限：

- `docker compose up -d postgres`
- `docker compose up -d`
- 本地浏览器联调：注册 -> 登录 -> 创建房间 -> 发送消息 -> 重新进入房间 -> 历史消息加载 -> 退出登录

受限原因：当前环境没有可用的 `docker` 命令。

## 发布结论

- 在当前可执行的自动化验证范围内，项目已经达到“可发布使用”的代码与构建状态。
- 本轮最关键的发布阻断项（生产来源校验、前端错误可见性、静态托管收口）已完成修复并补测。
- 剩余风险主要不是代码级阻断，而是缺少一次带 PostgreSQL 与浏览器的最终联调确认。

## 剩余非阻断风险

- 尚未在真实 PostgreSQL + 浏览器环境下复核完整认证与 WebSocket 交互链路。
- Kubernetes / 反向代理部署时，需要确保 `ALLOWED_ORIGINS` 与实际域名一致，否则生产前端将被拒绝跨域或 WebSocket 升级。
- 前端依赖存在 `npm audit` 提示的 2 个漏洞，但本轮未做依赖升级，以避免超出发布收口范围。

## 发布前最小人工确认

1. 在目标环境设置正确的 `JWT_SECRET` 与 `ALLOWED_ORIGINS`。
2. 跑一遍 PostgreSQL + 后端 + 前端的最小手测链路。
3. 若使用容器或 Kubernetes，确认 `/health`、`/ready`、首页与 `/ws` 在目标域名下都可访问。
