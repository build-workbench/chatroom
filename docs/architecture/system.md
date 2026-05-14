# 系统架构

## 系统概览

ChatRoom 是一个实时聊天室应用，采用前后端分离架构，支持 WebSocket 实时通信。项目专为教学设计，强调代码可读性和工程化实践。

## 技术栈

| 层级 | 技术选型 |
|------|----------|
| 后端 | Go 1.24, Gin, GORM, Gorilla WebSocket, zerolog |
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
└── openspec/                # 规约与活跃变更
```

## 整体架构

```mermaid
flowchart TB
    subgraph Client["客户端层 (Client Layer)"]
        B1["Browser<br/>React SPA"]
        B2["Browser<br/>React SPA"]
        B3["Browser<br/>React SPA"]
    end

    subgraph App["应用层 (Application Layer)"]
        subgraph Gin["Gin HTTP Server"]
            REST["REST API<br/>Handlers"]
            WS["WebSocket<br/>Handler"]
            Static["静态文件<br/>Static Files"]
        end
        
        subgraph Services["Service 层"]
            UserService["UserService"]
            RoomService["RoomService"]
            MsgService["MessageService"]
        end
        
        subgraph WSHub["WebSocket Hub"]
            Hub["Hub<br/>全局管理器"]
            RoomHub1["RoomHub<br/>Room 1"]
            RoomHub2["RoomHub<br/>Room 2"]
            Hub --> RoomHub1
            Hub --> RoomHub2
        end
        
        subgraph Realtime["分布式同步"]
            RT["Realtime<br/>Postgres NOTIFY"]
        end
    end

    subgraph MW["中间件层"]
        AuthMW["AuthMiddleware<br/>JWT 验证"]
        RateMW["RateLimit<br/>令牌桶限流"]
        CORS["CORS<br/>跨域处理"]
    end

    subgraph Data["数据层 (Data Layer)"]
        PG["PostgreSQL 16"]
        subgraph Tables["数据表"]
            Users["users"]
            Rooms["rooms"]
            Messages["messages"]
            RTokens["refresh_tokens"]
            WSTickets["ws_tickets"]
            WSSessions["ws_sessions"]
        end
        PG --> Tables
    end

    B1 & B2 & B3 -->|HTTP REST| CORS --> RateMW --> AuthMW --> REST
    B1 & B2 & B3 -->|WebSocket| WS
    
    REST --> UserService & RoomService & MsgService --> PG
    
    WS --> WSHub
    RoomHub1 & RoomHub2 --> RT
    RT --> PG
    
    WSHub -.->|LISTEN/NOTIFY| WSHub
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

### internal/ws

WebSocket 核心模块：

#### Hub 结构

```mermaid
flowchart TB
    subgraph Hub["Hub (全局)"]
        rooms["rooms map[uint]*RoomHub"]
        realtime["realtime *Realtime"]
        cleanup["cleanupAfter"]
    end
    
    subgraph RoomHub["RoomHub (房间级)"]
        clients["clients map[*Client]bool"]
        register["register chan *Client"]
        unregister["unregister chan *Client"]
        broadcast["broadcast chan []byte"]
        stop["stop chan struct{}"]
        online["online int32"]
    end
    
    Hub --> RoomHub
    RoomHub --> Client1["Client"]
    RoomHub --> Client2["Client"]
    RoomHub --> ClientN["Client ..."]
```

### internal/metrics

Prometheus 指标：

| 指标 | 类型 | 描述 |
|------|------|------|
| `chat_ws_connections` | Gauge | 当前 WebSocket 连接数 |
| `chat_ws_messages_total` | Counter | 累计消息数 |
| `http_requests_total` | Counter | HTTP 请求总数 |
| `http_request_duration_seconds` | Histogram | 请求延迟分布 |

---

## 部署架构

### 单实例部署

```mermaid
flowchart LR
    subgraph Internet["互联网"]
        Users["用户"]
    end
    
    subgraph Single["单实例部署"]
        Nginx["Nginx<br/>反向代理"]
        App["ChatRoom App<br/>Go + React"]
        PG["PostgreSQL"]
        Mon["Prometheus<br/>+ Grafana"]
    end
    
    Users --> Nginx --> App --> PG
    Nginx -.->|可选| Mon
```

### Kubernetes 部署

```mermaid
flowchart TB
    subgraph K8s["Kubernetes 集群"]
        Ingress["Ingress<br/>Nginx"]
        Service["Service<br/>ClusterIP"]
        Config["ConfigMap<br/>+ Secret"]
        
        subgraph Deploy["Deployment (HPA)"]
            Pod1["Pod 1<br/>ChatRoom"]
            Pod2["Pod 2<br/>ChatRoom"]
            PodN["Pod N<br/>ChatRoom"]
        end
        
        subgraph DB["数据层"]
            PGStateful["PostgreSQL<br/>StatefulSet"]
        end
    end
    
    Ingress --> Service --> Deploy --> PGStateful
    Config -.-> Deploy
```

---

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

---

🌐 **Languages**: [English](/en/architecture/system) | 简体中文