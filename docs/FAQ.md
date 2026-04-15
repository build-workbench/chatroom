# 常见问题

## 项目定位

### 这个项目是面向生产的吗？

**不是。** 它的主要目标是个人练手与教学演示。

但它并不只是一个"只会本地跑一下"的 demo。项目包含：

- 完整的测试覆盖（Go + 前端）
- CI/CD 流水线
- Docker 与 Kubernetes 部署配置
- Prometheus 监控指标
- VitePress 文档站

这些工程化实践本身就是很好的学习材料。

### 我能学到什么？

**后端**：
- Gin 路由与中间件的组织方式
- JWT + Refresh Token 鉴权流程
- GORM 与 PostgreSQL 的配合
- WebSocket 房间广播实现
- 分布式消息同步（PostgreSQL NOTIFY）

**前端**：
- React Hooks 状态管理
- WebSocket 连接与重连策略
- Token 自动刷新机制
- TypeScript 类型设计

**工程化**：
- 测试编写与 CI 配置
- Docker 多阶段构建
- Kubernetes 部署清单
- Prometheus 监控集成

---

## 技术选型

### 为什么同时有 REST API 和 WebSocket？

它们解决的问题不同：

| 场景 | 技术选择 |
|------|----------|
| 注册、登录 | REST API |
| 查房间、查历史 | REST API |
| 实时消息 | WebSocket |
| 在线状态、输入提示 | WebSocket |

REST 适合"请求-响应"模式，WebSocket 适合"实时推送"。这也是很多现代应用的标准架构。

### 为什么用 PostgreSQL 而不是 Redis？

**当前阶段**：PostgreSQL 足够满足需求，减少技术栈复杂度。

**分布式支持**：使用 PostgreSQL `LISTEN/NOTIFY` 实现跨实例消息同步，无需引入 Redis。

**未来扩展**：如需更高性能或更丰富的功能，可以平滑迁移到 Redis Pub/Sub。

### 为什么用 Tailwind CSS v4？

- 无需配置文件（`tailwind.config.js`）
- 构建更快（Rust 编写的引擎）
- 原子化 CSS，开发效率高
- 适合教学，减少 CSS 抽象

---

## 前端问题

### 为什么同时有 `frontend/` 和 `web/`？

| 目录 | 内容 | 用途 |
|------|------|------|
| `frontend/` | React 应用 | 开发、测试、构建 |
| `web/` | 静态 HTML/JS | `frontend/dist` 不存在时的回退 |

这是一个适合教学的设计：
- 展示"构建产物托管"概念
- 即使前端构建失败，项目仍可运行

### 前端测试用的是什么？

- **测试框架**：Vitest
- **测试类型**：单元测试（API、Socket、Storage）
- **测试数量**：20 个测试用例

运行测试：
```bash
npm --prefix frontend run test
```

### Token 存储在哪里？

**当前实现**：localStorage（教学简化）

**生产建议**：
- Access Token：内存 + httpOnly cookie
- Refresh Token：httpOnly cookie + Secure + SameSite

localStorage 有 XSS 风险，但教学项目优先考虑简单易懂。

---

## 后端问题

### 我应该先看哪部分代码？

推荐阅读顺序：

1. `cmd/server/main.go` — 理解启动流程
2. `internal/config/config.go` — 理解配置来源
3. `internal/server/router.go` — 理解路由结构
4. `internal/service/user.go` — 理解业务逻辑
5. `internal/ws/hub.go` — 理解 WebSocket 房间模型
6. `internal/ws/conn.go` — 理解消息处理
7. `frontend/src/App.tsx` — 理解前端架构

### 配置是如何加载的？

**关键点**：后端直接读取进程环境变量，**不会自动加载 `.env` 文件**。

```bash
# .env.example 是配置模板
# 运行 go run ./cmd/server 不会读取 .env

# 方式 1：直接设置环境变量
export JWT_SECRET=your-secret
go run ./cmd/server

# 方式 2：Docker Compose
# docker-compose.yml 中通过 environment 配置

# 方式 3：手动 source
set -a && source .env && set +a
go run ./cmd/server
```

### WebSocket 如何认证？

WebSocket 使用**一次性 Ticket** 认证，而非直接使用 Access Token：

```
1. 前端调用 POST /api/v1/ws/tickets 获取 ticket
2. 服务端生成并存储 ticket（有效期 60 秒）
3. 前端在 WebSocket Subprotocol 中携带 ticket
4. 服务端验证并消费 ticket
5. 建立 WebSocket 连接
```

**设计理由**：
- 避免在 URL 中暴露 Access Token
- Ticket 一次性消费，防止重放攻击
- 与特定房间绑定，防止跨房间滥用

---

## 部署问题

### `ALLOWED_ORIGINS` 是做什么的？

非 `dev` 环境下的来源校验：

| 场景 | 校验方式 |
|------|----------|
| HTTP CORS | 检查 Origin 头是否在白名单 |
| WebSocket 升级 | 检查 Origin 头是否在白名单 |

未命中白名单时，仅允许严格同源请求。

**配置示例**：
```env
ALLOWED_ORIGINS=https://chat.example.com,https://app.example.com:8443
```

### 如何在 Docker 中运行？

```bash
# 完整环境（数据库 + 应用）
docker compose up -d

# 仅数据库
docker compose up -d postgres
go run ./cmd/server

# 含监控
docker compose --profile monitoring up -d
```

### 文档站如何发布？

仓库已配置 GitHub Actions 工作流：

1. 推送到 `master` 分支
2. 自动构建 VitePress 文档站
3. 部署到 GitHub Pages

首次使用需在仓库设置中启用 GitHub Pages。

---

## 测试问题

### Go 测试为什么需要 PostgreSQL？

部分测试需要真实数据库：
- 用户注册/登录
- Token 存储/验证
- 消息持久化

```bash
# 启动数据库
docker compose up -d postgres

# 运行测试
go test -race ./...
```

### 如何运行所有测试？

```bash
# Go 测试
make test
# 或
go test -race -cover ./...

# 前端测试
npm --prefix frontend run test

# 全部测试
make test && npm --prefix frontend run test
```

---

## 开发问题

### 如何贡献代码？

1. Fork 仓库
2. 创建分支：`git checkout -b feature/your-feature`
3. 提交代码：遵循提交信息规范（中文，祈使句）
4. 确保测试通过：`make test`
5. 确保代码检查通过：`make lint`
6. 创建 Pull Request

详见 [贡献指南](https://github.com/LessUp/chatroom/blob/master/CONTRIBUTING.md)。

### 遇到问题怎么办？

1. 查看 [API 文档](/API)
2. 查看 [架构文档](/ARCHITECTURE)
3. 查看 [手动测试实验](/manual-testing)
4. 在 GitHub Issues 中搜索或提问

---

## 其他问题

### 项目的 Git 分支策略是什么？

- `master`：主分支，默认分支
- `feature/*`：功能分支
- `fix/*`：修复分支

### 版本号规则？

遵循 [语义化版本](https://semver.org/lang/zh-CN/)：
- `MAJOR`：不兼容的 API 变更
- `MINOR`：向后兼容的功能新增
- `PATCH`：向后兼容的问题修复

当前版本：`0.2.x`
