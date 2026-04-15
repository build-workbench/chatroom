# ChatRoom 架构文档

## 系统概览

ChatRoom 是一个实时聊天室应用，采用前后端分离架构，支持 WebSocket 实时通信。项目专为教学设计，强调代码可读性和工程化实践。

## 技术栈

| 层级 | 技术选型 |
|------|----------|
| 后端 | Go 1.24, Gin, GORM, gorilla/websocket, zerolog |
| 前端 | React 19, TypeScript, Vite 7, Tailwind CSS v4 |
| 数据库 | PostgreSQL 16 |
| 监控 | Prometheus, Grafana |
| 部署 | Docker, Kubernetes |

## 目录结构

```
chatroom/
├── cmd/server/              # 程序入口
│   └── main.go              # 启动、配置、优雅停服
├── internal/                # 内部包（不可被外部导入）
│   ├── auth/                # JWT、密码哈希、Token 管理
│   ├── config/              # 配置加载与校验
│   ├── db/                  # 数据库连接、迁移、清理
│   ├── log/                 # zerolog 初始化
│   ├── metrics/             # Prometheus 指标
│   ├── models/              # GORM 数据模型
│   ├── mw/                  # Gin 中间件（认证、限流、CORS）
│   ├── quality/             # 代码质量工具
│   ├── server/              # HTTP 路由与 Handler
│   ├── service/             # 业务逻辑层
│   └── ws/                  # WebSocket Hub、连接、分布式支持
├── frontend/                # React 主前端
│   └── src/
│       ├── components/      # UI 组件
│       ├── hooks/           # 自定义 Hooks
│       ├── screens/         # 页面组件
│       └── *.ts             # API、Socket、Storage 等
├── web/                     # 静态回退 UI
├── docs/                    # VitePress 文档站
├── deploy/                  # 部署配置
│   ├── docker/              # Dockerfile
│   ├── k8s/                 # Kubernetes 清单
│   └── prometheus/          # Prometheus 配置
└── changelog/               # 细粒度变更记录
```

## 架构图

### 整体架构

```
┌─────────────────────────────────────────────────────────────────────┐
│                           Client Layer                               │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │
│  │   Browser   │  │   Browser   │  │   Browser   │   ...            │
│  │  (React)    │  │  (React)    │  │  (React)    │                  │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘                  │
│         │                │                │                          │
│         └────────────────┼────────────────┘                          │
│                          │                                           │
│              HTTP REST / WebSocket                                   │
└──────────────────────────┼───────────────────────────────────────────┘
                           │
┌──────────────────────────┼───────────────────────────────────────────┐
│                    Application Layer                                 │
├──────────────────────────┼───────────────────────────────────────────┤
│                          ▼                                           │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    Gin HTTP Server                             │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │  │
│  │  │  REST API   │  │  WebSocket  │  │   Static    │            │  │
│  │  │  Handlers   │  │   Handler   │  │   Files     │            │  │
│  │  └──────┬──────┘  └──────┬──────┘  └─────────────┘            │  │
│  └─────────┼────────────────┼────────────────────────────────────┘  │
│            │                │                                        │
│            ▼                ▼                                        │
│  ┌─────────────────┐  ┌─────────────────────────────────────────┐   │
│  │   Service 层    │  │           WebSocket 层                   │   │
│  │  ┌───────────┐  │  │  ┌─────────────────────────────────┐    │   │
│  │  │ UserService│  │  │  │            Hub                  │    │   │
│  │  ├───────────┤  │  │  │  ┌─────────┐  ┌─────────┐       │    │   │
│  │  │ RoomService│  │  │  │  │RoomHub 1│  │RoomHub 2│  ...  │    │   │
│  │  ├───────────┤  │  │  │  └────┬────┘  └────┬────┘       │    │   │
│  │  │MsgService │  │  │  │       │            │             │    │   │
│  │  └───────────┘  │  │  │  ┌────┴────┐  ┌────┴────┐       │    │   │
│  └─────────────────┘  │  │  │Clients  │  │Clients  │       │    │   │
│                       │  │  └─────────┘  └─────────┘       │    │   │
│                       │  └─────────────────────────────────┘    │   │
│                       │                 │                        │   │
│                       │                 ▼                        │   │
│                       │     ┌───────────────────┐                │   │
│                       │     │    Realtime       │                │   │
│                       │     │ (Postgres NOTIFY) │                │   │
│                       │     └───────────────────┘                │   │
│                       └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                           │
┌──────────────────────────┼───────────────────────────────────────────┐
│                       Data Layer                                     │
├──────────────────────────┼───────────────────────────────────────────┤
│                          ▼                                           │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    PostgreSQL 16                              │  │
│  │  ┌─────────┐ ┌─────────┐ ┌──────────┐ ┌──────────────┐       │  │
│  │  │  users  │ │  rooms  │ │ messages │ │refresh_tokens│       │  │
│  │  └─────────┘ └─────────┘ └──────────┘ └──────────────┘       │  │
│  │  ┌─────────────┐ ┌─────────────┐                             │  │
│  │  │ ws_sessions │ │ ws_tickets  │                             │  │
│  │  └─────────────┘ └─────────────┘                             │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

## 模块详解

### cmd/server

程序入口点，职责：

1. **配置加载**：调用 `config.Load()` 从环境变量读取配置
2. **日志初始化**：调用 `clog.Init()` 配置 zerolog
3. **配置校验**：调用 `config.Validate()` 确保必要参数有效
4. **数据库连接**：调用 `db.Connect()` 建立连接池
5. **数据库迁移**：调用 `db.Migrate()` 自动迁移表结构
6. **启动清理任务**：调用 `db.StartCleanup()` 定期清理过期数据
7. **创建 Hub**：调用 `ws.NewHub()` 创建 WebSocket 管理器
8. **构建路由**：调用 `server.SetupRouter()` 创建 Gin 引擎
9. **启动 HTTP 服务**：在独立 goroutine 中监听请求
10. **优雅停服**：捕获信号，依次关闭 Hub、清理任务、HTTP 服务、数据库连接

### internal/config

配置管理模块：

```go
type Config struct {
    Port                  string   // HTTP 监听端口
    DatabaseDSN           string   // 数据库连接串
    JWTSecret             string   // JWT 签名密钥
    Env                   string   // 运行环境 (dev/staging/production)
    LogLevel              string   // 日志级别
    LogFormat             string   // 日志格式 (console/json)
    AccessTokenTTLMinutes int      // Access Token 有效期
    RefreshTokenTTLDays   int      // Refresh Token 有效期
    WSTicketTTLSeconds    int      // WebSocket Ticket 有效期
    AllowedOrigins        []string // CORS 允许的来源列表
    PodID                 string   // 实例标识（分布式场景）
}
```

**安全校验**：
- 非 `dev` 环境禁止使用默认 JWT 密钥
- 校验 `ALLOWED_ORIGINS` 格式正确性
- 校验 `LOG_LEVEL` 为有效值

### internal/auth

认证与授权模块：

| 函数 | 用途 |
|------|------|
| `HashPassword` | 使用 bcrypt 哈希密码 |
| `VerifyPassword` | 验证密码与哈希是否匹配 |
| `GenerateAccessToken` | 签发 JWT Access Token |
| `ParseAccessToken` | 解析并验证 JWT |
| `GenerateRefreshToken` | 生成随机 Refresh Token |
| `ValidateRefreshToken` | 验证 Refresh Token 有效性 |
| `RevokeRefreshToken` | 撤销 Refresh Token |
| `GenerateAndStoreWSTicket` | 生成并存储 WebSocket Ticket |
| `ValidateAndConsumeWSTicket` | 验证并消费 WebSocket Ticket |

### internal/server

HTTP 服务层：

```
Handler ──依赖──> Service 接口 ──实现──> Service 结构体 ──依赖──> *gorm.DB
```

**路由设计**：

```
/health      GET  健康检查
/healthz     GET  健康检查（K8s 兼容）
/ready       GET  就绪检查
/version     GET  版本信息
/metrics     GET  Prometheus 指标

/api/v1/auth/register    POST   用户注册
/api/v1/auth/login       POST   用户登录
/api/v1/auth/refresh     POST   刷新令牌

/api/v1/rooms            GET    房间列表
/api/v1/rooms            POST   创建房间
/api/v1/rooms/:id/messages  GET 获取消息

/api/v1/ws/tickets       POST   获取 WS Ticket

/ws                      GET    WebSocket 连接
```

### internal/service

业务逻辑层，封装核心业务：

- **UserService**：用户注册、登录、令牌刷新
- **RoomService**：房间创建、查询、在线人数统计
- **MessageService**：消息分页查询、用户名批量解析

### internal/ws

WebSocket 核心模块：

#### Hub 结构

```
Hub（全局）
├── rooms map[uint]*RoomHub  # 房间 ID → RoomHub
├── realtime *Realtime       # 分布式支持（Postgres NOTIFY）
└── cleanupAfter             # 空房间清理时间

RoomHub（房间级）
├── clients map[*Client]bool # 房间内所有连接
├── register   chan *Client  # 注册通道
├── unregister chan *Client  # 注销通道
├── broadcast  chan []byte   # 广播通道
├── stop       chan struct{} # 停止信号
└── online     int32         # 在线人数
```

#### 消息流转

```
Client.readPump()
    │
    ├─ ping ──────> 更新心跳时间 ──> 回复 pong
    │
    ├─ typing ────> 广播 typing 事件
    │
    └─ message ───> 持久化到 DB ──> 广播 message 事件
                         │
                         ▼
                   RoomHub.broadcast
                         │
                         ▼
                   所有 Client.writePump()
```

#### Realtime（分布式支持）

PostgreSQL `LISTEN/NOTIFY` 实现跨实例消息同步：

```
实例 A                    Postgres                    实例 B
   │                         │                          │
   │  NOTIFY chatroom_ws_events                        │
   ├────────────────────────>│                          │
   │                         │  NOTIFY chatroom_ws_events
   │                         │<─────────────────────────┤
   │                         │                          │
   │  LISTEN ───────────────>│                          │
   │                         │<─────────── LISTEN       │
   │                         │                          │
   │           收到通知，广播给本实例客户端              │
```

### internal/db

数据库管理模块：

| 函数 | 用途 |
|------|------|
| `Connect` | 建立数据库连接，配置连接池 |
| `Migrate` | 自动迁移数据表结构 |
| `StartCleanup` | 启动后台清理任务 |

**清理任务**（每小时执行）：
- 清理过期的 Refresh Token
- 清理已消费/过期的 WebSocket Ticket
- 清理超时的 WebSocket Session

### internal/mw

HTTP 中间件：

| 中间件 | 功能 |
|--------|------|
| `AuthMiddleware` | Bearer Token 验证，注入用户信息到 Context |
| `RateLimit` | IP + 路径维度的令牌桶限流 |
| `CORS` | 跨域请求处理 |

### internal/metrics

Prometheus 指标：

| 指标 | 类型 | 描述 |
|------|------|------|
| `chat_ws_connections` | Gauge | 当前 WebSocket 连接数 |
| `chat_ws_messages_total` | Counter | 累计消息数 |
| `http_requests_total` | Counter | HTTP 请求总数 |
| `http_request_duration_seconds` | Histogram | 请求延迟分布 |

## 数据模型

### ER 图

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    users     │       │    rooms     │       │   messages   │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │       │ id (PK)      │       │ id (PK)      │
│ username     │       │ name         │       │ room_id (FK) │
│ password_hash│       │ owner_id(FK) │───────│ user_id (FK) │
│ created_at   │       │ created_at   │       │ content      │
│ updated_at   │       │ updated_at   │       │ created_at   │
└──────────────┘       └──────────────┘       └──────────────┘
       │                      │
       │                      │
       ▼                      │
┌──────────────┐              │
│refresh_tokens│              │
├──────────────┤              │
│ id (PK)      │              │
│ user_id (FK) │              │
│ token        │              │
│ expires_at   │              │
│ revoked_at   │              │
│ created_at   │              │
└──────────────┘              │
                              │
┌──────────────┐              │
│  ws_tickets  │              │
├──────────────┤              │
│ ticket_id(PK)│              │
│ user_id (FK) │◄─────────────┘
│ room_id (FK) │
│ expires_at   │
│ consumed_at  │
│ created_at   │
│ updated_at   │
└──────────────┘

┌──────────────┐
│ ws_sessions  │
├──────────────┤
│ session_id(PK)│
│ room_id (FK) │
│ user_id (FK) │
│ pod_id       │
│ last_seen_at │
│ created_at   │
│ updated_at   │
└──────────────┘
```

### 表说明

| 表名 | 用途 | 关键索引 |
|------|------|----------|
| `users` | 用户账户 | username (unique) |
| `rooms` | 聊天房间 | name (unique), owner_id |
| `messages` | 聊天消息 | room_id, user_id, created_at |
| `refresh_tokens` | 刷新令牌 | user_id, token (unique), expires_at |
| `ws_tickets` | WebSocket 认证票据 | user_id, room_id, expires_at |
| `ws_sessions` | WebSocket 会话（分布式在线统计） | room_id, user_id, pod_id |

## 关键流程

### 认证流程

```
┌─────────┐     ┌─────────┐     ┌──────────┐     ┌─────────┐
│  用户   │     │  前端   │     │  后端    │     │ 数据库  │
└────┬────┘     └────┬────┘     └────┬─────┘     └────┬────┘
     │               │               │                │
     │  输入用户名密码 │               │                │
     │──────────────>│               │                │
     │               │  POST /login  │                │
     │               │──────────────>│                │
     │               │               │   查询用户     │
     │               │               │───────────────>│
     │               │               │   返回用户     │
     │               │               │<───────────────│
     │               │               │                │
     │               │               │ 验证密码       │
     │               │               │ 生成 JWT       │
     │               │               │ 生成 RT        │
     │               │               │ 存储 RT        │
     │               │               │───────────────>│
     │               │  access_token │                │
     │               │  refresh_token│                │
     │               │<──────────────│                │
     │  存储到 localStorage          │                │
     │<──────────────│               │                │
```

### WebSocket 连接流程

```
┌─────────┐     ┌─────────┐     ┌──────────┐     ┌─────────┐
│  用户   │     │  前端   │     │  后端    │     │ 数据库  │
└────┬────┘     └────┬────┘     └────┬─────┘     └────┬────┘
     │               │               │                │
     │  进入房间      │               │                │
     │──────────────>│               │                │
     │               │ POST /ws/tickets              │
     │               │──────────────>│                │
     │               │               │ 生成 Ticket    │
     │               │               │ 存储 Ticket    │
     │               │               │───────────────>│
     │               │   ticket      │                │
     │               │<──────────────│                │
     │               │               │                │
     │               │ WebSocket 连接│                │
     │               │ (带 Ticket)   │                │
     │               │──────────────>│                │
     │               │               │ 验证 Ticket    │
     │               │               │ 消费 Ticket    │
     │               │               │───────────────>│
     │               │               │ 创建 Session   │
     │               │               │───────────────>│
     │               │               │                │
     │               │               │ 广播 join 事件 │
     │               │<──────────────│                │
     │  显示用户加入  │               │                │
     │<──────────────│               │                │
```

## 部署架构

### 单实例部署

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Nginx     │────>│  ChatRoom   │────>│ PostgreSQL  │
│  (反向代理)  │     │    App      │     │   数据库    │
└─────────────┘     └─────────────┘     └─────────────┘
      │
      │ (可选)
      ▼
┌─────────────┐
│ Prometheus  │
│   + Grafana │
└─────────────┘
```

### Kubernetes 部署

```
┌─────────────────────────────────────────────────────────────┐
│                        Kubernetes                            │
│                                                              │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐        │
│  │   Ingress   │   │   Service   │   │  ConfigMap  │        │
│  │  (Nginx)    │   │  (ClusterIP)│   │  + Secret   │        │
│  └──────┬──────┘   └──────┬──────┘   └─────────────┘        │
│         │                 │                                  │
│         ▼                 ▼                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                   Deployment (HPA)                    │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐            │   │
│  │  │  Pod 1   │  │  Pod 2   │  │  Pod N   │            │   │
│  │  │ (ChatRoom│  │ (ChatRoom│  │ (ChatRoom│   ...      │   │
│  │  └──────────┘  └──────────┘  └──────────┘            │   │
│  └──────────────────────────────────────────────────────┘   │
│                           │                                  │
│                           ▼                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              PostgreSQL StatefulSet                   │   │
│  │              (或外部数据库服务)                         │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 安全设计

### 认证与授权

| 机制 | 说明 |
|------|------|
| JWT Access Token | 短期有效（默认 15 分钟），用于 API 认证 |
| Refresh Token | 长期有效（默认 7 天），存储于数据库，支持轮换 |
| WebSocket Ticket | 一次性票据（默认 60 秒有效），防止 Token 泄露 |

### 防护措施

| 措施 | 实现位置 |
|------|----------|
| 密码哈希 | bcrypt，cost=10 |
| 速率限制 | IP + 路径维度，令牌桶算法 |
| CORS 校验 | 严格 origin 白名单 |
| 输入验证 | 所有请求参数校验 |
| 消息长度限制 | 单条消息最大 2000 字符 |
| WebSocket 消息大小限制 | 最大 1 MB |

### 生产环境建议

1. **JWT 密钥**：使用强随机密钥（≥32 字节）
2. **HTTPS**：生产环境必须启用 TLS
3. **数据库**：使用强密码，限制网络访问
4. **ALLOWED_ORIGINS**：严格配置允许的前端域名

## 扩展考虑

### 水平扩展

当前 WebSocket Hub 仅在单进程内共享。水平扩展需要：

1. **PostgreSQL NOTIFY**（已实现）：跨实例消息广播
2. **会话持久化**（已实现）：`ws_sessions` 表存储在线状态
3. **Sticky Sessions**（可选）：确保 WebSocket 连接路由到同一实例

### 功能扩展建议

| 功能 | 实现思路 |
|------|----------|
| 消息富文本 | 为 `messages` 表添加 `metadata JSONB` 字段 |
| 私密房间 | 为 `rooms` 表添加 `visibility` 字段 |
| 消息搜索 | 引入全文索引或 Elasticsearch |
| 文件上传 | 对象存储 + 预签名 URL |
