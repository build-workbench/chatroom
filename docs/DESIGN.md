# ChatRoom 设计文档

## 系统概览

ChatRoom 是一个面向教学与个人练手的实时聊天室项目，核心目标是**可运行、可理解、可验证、可扩展**。

### 设计哲学

| 原则 | 实践 |
|------|------|
| 教学优先 | 代码清晰，避免过度抽象 |
| 功能适度 | 覆盖核心场景，不做功能堆砌 |
| 工程完备 | 测试、CI、部署、监控一应俱全 |
| 文档同步 | 代码与文档保持一致 |

### 技术选型理由

| 技术 | 选择理由 |
|------|----------|
| Go + Gin | 性能好、生态成熟、适合教学 |
| GORM | ORM 简化数据库操作，支持多种数据库 |
| gorilla/websocket | 成熟稳定，功能完整 |
| PostgreSQL | 功能强大，支持 LISTEN/NOTIFY |
| React + TypeScript | 类型安全，生态丰富 |
| Vite | 开发体验好，构建快 |
| Tailwind CSS v4 | 无需配置文件，原子化 CSS |

---

## 模块拆分

### 后端架构

```
cmd/server/main.go           # 入口：配置、启动、优雅停服
│
├── internal/config/         # 配置管理
│   └── 从环境变量加载，集中校验
│
├── internal/db/             # 数据库层
│   ├── Connect()            # 连接池配置
│   ├── Migrate()            # 自动迁移
│   └── StartCleanup()       # 后台清理任务
│
├── internal/auth/           # 认证模块
│   ├── 密码哈希 (bcrypt)
│   ├── JWT 签发与验证
│   ├── Refresh Token 管理
│   └── WebSocket Ticket 管理
│
├── internal/server/         # HTTP 层
│   ├── router.go            # 路由定义
│   └── handler.go           # 请求处理
│
├── internal/service/        # 业务逻辑层
│   ├── user.go              # 用户业务
│   ├── room.go              # 房间业务
│   └── message.go           # 消息业务
│
├── internal/ws/             # WebSocket 层
│   ├── hub.go               # 房间管理
│   ├── conn.go              # 连接处理
│   └── realtime.go          # 分布式支持
│
├── internal/mw/             # 中间件
│   ├── auth.go              # JWT 验证
│   ├── ratelimit.go         # 限流
│   └── cors.go              # 跨域
│
├── internal/metrics/        # 监控指标
│   └── Prometheus 指标定义
│
├── internal/log/            # 日志
│   └── zerolog 初始化
│
└── internal/models/         # 数据模型
    ├── User, Room, Message
    ├── RefreshToken
    ├── WSTicket, WSSession
```

### 前端架构

```
frontend/src/
├── App.tsx                  # 根组件，组合各 Hook
│
├── components/              # UI 组件
│   ├── ChatRoom.tsx         # 聊天室主界面
│   ├── MessageList.tsx      # 消息列表
│   ├── MessageInput.tsx     # 消息输入框
│   └── Sidebar.tsx          # 侧边栏
│
├── hooks/                   # 自定义 Hooks
│   ├── useAuth.ts           # 认证状态管理
│   ├── useChat.ts           # 聊天状态管理
│   └── useChatSocket.ts     # WebSocket 管理
│
├── screens/
│   └── AuthScreen.tsx       # 登录/注册页面
│
├── api.ts                   # REST API 封装
├── socket.ts                # WebSocket 封装
├── storage.ts               # localStorage 封装
├── types.ts                 # TypeScript 类型定义
└── toast.tsx                # Toast 通知组件
```

---

## 关键设计决策

### 1. 双 Token 体系

```
Access Token (JWT)
├── 有效期短（15 分钟）
├── 无状态，服务端不存储
└── 用于 API 请求认证

Refresh Token (随机字符串)
├── 有效期长（7 天）
├── 存储于数据库
├── 支持撤销和轮换
└── 用于刷新 Access Token
```

**设计理由**：
- Access Token 短期有效，即使泄露影响有限
- Refresh Token 可撤销，支持"登出所有设备"
- Token Rotation 每次刷新都换新，降低重放风险

### 2. WebSocket Ticket 认证

WebSocket 连接不直接使用 Access Token，而是通过一次性 Ticket 认证：

```
1. 前端调用 POST /api/v1/ws/tickets 获取 ticket
2. 服务端生成 JWT ticket，存储到 ws_tickets 表
3. 前端在 WebSocket Subprotocol 中携带 ticket
4. 服务端验证并消费 ticket，建立连接
```

**设计理由**：
- 避免在 URL 中暴露 Access Token（浏览器历史、日志）
- Ticket 一次性消费，防止重放攻击
- Ticket 与房间绑定，防止跨房间滥用

### 3. Hub 房间模型

```
Hub（全局单例）
├── rooms map[uint]*RoomHub  # 懒加载
├── realtime *Realtime       # 分布式广播
└── cleanupAfter             # 空房间清理

RoomHub（房间级）
├── 单独 goroutine 运行
├── 管理 room 内所有 client
├── 处理 register/unregister/broadcast
└── 空房间自动清理（3 分钟后）
```

**设计理由**：
- 房间级隔离，避免全局锁竞争
- 懒加载减少内存占用
- 空房间自动清理释放资源

### 4. 分布式支持

通过 PostgreSQL `LISTEN/NOTIFY` 实现跨实例消息同步：

```
实例 A 收到消息
    │
    ├── 广播给本实例客户端
    │
    └── NOTIFY chatroom_ws_events
            │
            ▼
        PostgreSQL
            │
            ▼
        实例 B 收到 NOTIFY
            │
            └── 广播给本实例客户端
```

**设计理由**：
- 复用现有 PostgreSQL，无需引入 Redis
- 简单可靠，适合教学演示
- 生产环境可替换为 Redis Pub/Sub

### 5. 前端状态管理

使用 React Hooks + Refs 打破循环依赖：

```typescript
// 用 ref 存储 callback，避免 useEffect 依赖循环
const chatResetRef = useRef<() => void>(() => {})
const socketCloseRef = useRef<() => void>(() => {})

// 在后续赋值
chatResetRef.current = chat.resetChat
socketCloseRef.current = () => socketRef.current?.close()
```

**设计理由**：
- 避免引入额外状态管理库
- 保持代码简洁，适合教学
- Ref 打破循环，Callback 保持最新

---

## 数据流

### 认证数据流

```
用户输入
    │
    ▼
前端 api.login()
    │
    ▼
POST /api/v1/auth/login
    │
    ▼
UserService.Login()
    ├── 查询用户
    ├── 验证密码
    ├── 生成 JWT
    ├── 生成 RefreshToken
    └── 存储 RefreshToken
    │
    ▼
返回 { access_token, refresh_token, user }
    │
    ▼
前端存储到 localStorage
    │
    ▼
后续请求携带 Authorization: Bearer <token>
```

### WebSocket 数据流

```
用户发送消息
    │
    ▼
前端 socket.sendMessage(content)
    │
    ▼
WebSocket 发送 { type: "message", content }
    │
    ▼
服务端 Client.readPump()
    ├── 解析消息
    ├── 校验长度
    └── 持久化到 DB
    │
    ▼
广播到 RoomHub.broadcast channel
    │
    ▼
RoomHub.run() goroutine
    ├── 分发到所有 Client.send
    └── NOTIFY 到其他实例
    │
    ▼
各 Client.writePump()
    │
    ▼
前端 WebSocket.onmessage
    │
    ▼
更新消息列表 UI
```

---

## 安全考量

### 已实现的安全措施

| 措施 | 实现方式 |
|------|----------|
| 密码存储 | bcrypt 哈希，cost=10 |
| JWT 密钥 | 非 dev 环境强制校验 |
| 速率限制 | IP + 路径维度，令牌桶 |
| CORS | 严格 origin 校验 |
| 输入验证 | 所有请求参数校验 |
| 消息长度 | 单条最大 2000 字符 |
| WS 消息大小 | 最大 1 MB |
| WS Ticket | 一次性消费，防重放 |

### 前端安全

| 措施 | 说明 |
|------|------|
| Token 存储 | localStorage（教学简化，生产建议 httpOnly cookie） |
| XSS 防护 | React 默认转义，避免 dangerouslySetInnerHTML |
| 敏感信息 | 密码不记录日志，Token 不打印 |

---

## 性能考量

### 后端优化

| 优化点 | 实现 |
|--------|------|
| 连接池 | MaxOpenConns=20, MaxIdleConns=5 |
| 慢客户端 | 发送缓冲区满时断开连接 |
| 房间清理 | 空房间 3 分钟后清理 |
| 指标采集 | Prometheus 中间件，低开销 |

### 前端优化

| 优化点 | 实现 |
|--------|------|
| 代码分割 | Vite 自动处理 |
| CSS | Tailwind CSS v4 原子化 |
| WebSocket 重连 | 指数退避，最多 10 次 |
| 消息队列 | 断线时消息入队，重连后发送 |

---

## 扩展方向

### 功能扩展

| 功能 | 实现思路 |
|------|----------|
| 消息富文本 | `messages.metadata JSONB` 字段 |
| 私密房间 | `rooms.visibility` 字段 + 权限检查 |
| @提及 | 解析 `@username`，生成通知 |
| 消息搜索 | PostgreSQL 全文索引或 Elasticsearch |
| 文件上传 | S3/OSS + 预签名 URL |
| 消息撤回 | 软删除 + 广播撤回事件 |

### 架构扩展

| 场景 | 解决方案 |
|------|----------|
| 高并发 | 连接池调优、消息队列 |
| 多实例 | Redis Pub/Sub 替代 Postgres NOTIFY |
| 全球部署 | 多区域数据库、边缘节点 |
| 大规模房间 | 房间分片、消息分区 |

---

## 开发约定

### 代码风格

| 语言 | 规范 |
|------|------|
| Go | gofmt, goimports, 中文注释, 表驱动测试 |
| TypeScript | ESLint, Prettier, 函数组件 + Hooks |
| 提交信息 | 中文，祈使句，50 字符以内 |

### 目录约定

```
internal/      # 内部包，不对外暴露
cmd/           # 可执行程序入口
frontend/src/  # React 源码
web/           # 静态回退 UI
docs/          # VitePress 文档站
deploy/        # 部署配置
```

### 测试约定

| 测试类型 | 位置 |
|----------|------|
| Go 单元测试 | `*_test.go`，同包 |
| Go 集成测试 | 需要 Postgres，CI 中运行 |
| 前端测试 | `*.test.ts`，Vitest |

---

## 运维考量

### 健康检查

| 端点 | 用途 |
|------|------|
| `/health` | 存活检查 |
| `/healthz` | K8s 兼容存活检查 |
| `/ready` | 就绪检查（含 DB 连通性） |
| `/version` | 版本信息 |

### 日志

| 配置 | 默认值 |
|------|--------|
| 格式 | console（开发）/ json（生产） |
| 级别 | info |
| 输出 | stdout |

### 监控

| 指标 | 类型 |
|------|------|
| `chat_ws_connections` | Gauge |
| `chat_ws_messages_total` | Counter |
| `http_requests_total` | Counter |
| `http_request_duration_seconds` | Histogram |

### 清理任务

后台每小时执行：
- 清理过期/已撤销的 Refresh Token
- 清理已消费/过期的 WebSocket Ticket
- 清理超时的 WebSocket Session
