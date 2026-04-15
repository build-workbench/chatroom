# ChatRoom API 文档

## 概述

ChatRoom 提供 RESTful API 和 WebSocket 接口用于实时聊天功能。

| 属性 | 值 |
|------|-----|
| Base URL | `http://localhost:8080` |
| API 前缀 | `/api/v1` |
| 认证方式 | Bearer Token (JWT) |
| 数据格式 | JSON |

## 目录

- [认证](#认证)
  - [注册](#注册)
  - [登录](#登录)
  - [刷新令牌](#刷新令牌)
- [房间](#房间)
  - [创建房间](#创建房间)
  - [获取房间列表](#获取房间列表)
  - [获取房间消息](#获取房间消息)
- [WebSocket](#websocket)
  - [获取 WebSocket Ticket](#获取-websocket-ticket)
  - [建立连接](#建立连接)
  - [消息格式](#消息格式)
- [健康检查](#健康检查)
- [错误处理](#错误处理)

---

## 认证

所有需要认证的接口都需要在请求头中携带 Bearer Token：

```
Authorization: Bearer <access_token>
```

### 注册

创建新用户账户。

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

**请求参数**

| 字段 | 类型 | 必填 | 约束 | 描述 |
|------|------|------|------|------|
| username | string | 是 | 2-64 字符 | 用户名，唯一 |
| password | string | 是 | 4-128 字符 | 密码 |

**响应示例**

```json
{
  "id": 1,
  "username": "alice"
}
```

**错误响应**

| 状态码 | 错误信息 | 描述 |
|--------|----------|------|
| 400 | invalid payload | 请求参数格式错误 |
| 409 | username taken | 用户名已存在 |
| 429 | too many requests | 请求过于频繁 |

---

### 登录

用户登录获取访问令牌和刷新令牌。

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

**响应示例**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "a1b2c3d4e5f6789012345678901234567890abcdef...",
  "user": {
    "id": 1,
    "username": "alice"
  }
}
```

**Token 说明**

| Token 类型 | 有效期 | 存储位置 | 用途 |
|-----------|--------|----------|------|
| Access Token | 15 分钟（默认） | 内存 / localStorage | API 请求认证 |
| Refresh Token | 7 天（默认） | 数据库 + localStorage | 刷新 Access Token |

**错误响应**

| 状态码 | 错误信息 | 描述 |
|--------|----------|------|
| 400 | invalid payload | 请求参数格式错误 |
| 401 | invalid credentials | 用户名或密码错误 |
| 429 | too many requests | 请求过于频繁 |

---

### 刷新令牌

使用刷新令牌获取新的访问令牌（Token Rotation）。

```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refresh_token": "string"
}
```

**响应示例**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "新的刷新令牌..."
}
```

::: tip Token Rotation
每次刷新都会：
1. 验证旧 Refresh Token 的有效性
2. 撤销旧 Refresh Token
3. 签发新的 Access Token + Refresh Token 对
:::

**错误响应**

| 状态码 | 错误信息 | 描述 |
|--------|----------|------|
| 400 | invalid payload | 请求参数格式错误 |
| 401 | invalid refresh token | 刷新令牌无效或已过期 |

---

## 房间

### 创建房间

创建新的聊天房间。

```http
POST /api/v1/rooms
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "string"
}
```

**请求参数**

| 字段 | 类型 | 必填 | 约束 | 描述 |
|------|------|------|------|------|
| name | string | 是 | 最大 128 字符 | 房间名称，唯一 |

**响应示例**

```json
{
  "room": {
    "id": 1,
    "name": "General"
  }
}
```

**错误响应**

| 状态码 | 错误信息 | 描述 |
|--------|----------|------|
| 400 | invalid payload | 请求参数格式错误 |
| 401 | missing bearer token | 未提供认证令牌 |
| 409 | room name taken | 房间名已存在 |

---

### 获取房间列表

获取所有聊天房间及在线人数。

```http
GET /api/v1/rooms
Authorization: Bearer <access_token>
```

**响应示例**

```json
{
  "rooms": [
    {
      "id": 1,
      "name": "General",
      "online": 5
    },
    {
      "id": 2,
      "name": "Random",
      "online": 2
    }
  ]
}
```

**说明**

- `online` 字段包含当前房间内的 WebSocket 连接数
- 分布式部署时，在线人数会聚合所有实例的会话数据

---

### 获取房间消息

分页获取指定房间的历史消息。

```http
GET /api/v1/rooms/:id/messages?limit=50&before_id=100
Authorization: Bearer <access_token>
```

**路径参数**

| 参数 | 类型 | 描述 |
|------|------|------|
| id | int | 房间 ID |

**查询参数**

| 参数 | 类型 | 默认值 | 约束 | 描述 |
|------|------|--------|------|------|
| limit | int | 50 | 1-200 | 返回消息数量 |
| before_id | int | - | > 0 | 获取此 ID 之前的消息（用于分页） |

**响应示例**

```json
{
  "messages": [
    {
      "type": "message",
      "id": 100,
      "room_id": 1,
      "user_id": 1,
      "username": "alice",
      "content": "Hello, world!",
      "created_at": "2025-01-08T10:00:00Z"
    },
    {
      "type": "message",
      "id": 99,
      "room_id": 1,
      "user_id": 2,
      "username": "bob",
      "content": "Hi there!",
      "created_at": "2025-01-08T09:59:00Z"
    }
  ]
}
```

::: tip 分页说明
消息按 `id` 升序返回。首次加载不带 `before_id`，后续加载使用最早一条消息的 `id` 作为 `before_id`。
:::

**错误响应**

| 状态码 | 错误信息 | 描述 |
|--------|----------|------|
| 400 | invalid room id | 房间 ID 格式错误 |
| 401 | missing bearer token | 未提供认证令牌 |
| 404 | room not found | 房间不存在 |

---

## WebSocket

WebSocket 连接需要先获取一次性 Ticket，再使用 Ticket 建立连接。

### 获取 WebSocket Ticket

WebSocket 使用一次性 Ticket 进行认证，而非直接使用 Access Token。

```http
POST /api/v1/ws/tickets
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "room_id": 1
}
```

**请求参数**

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| room_id | int | 是 | 要加入的房间 ID |

**响应示例**

```json
{
  "ticket": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 60
}
```

**Ticket 说明**

| 属性 | 值 | 说明 |
|------|-----|------|
| 有效期 | 60 秒（默认） | 短期有效，防止重放攻击 |
| 使用次数 | 1 次 | 一次性消费，使用后立即失效 |
| 绑定房间 | 是 | Ticket 与特定房间绑定 |

**错误响应**

| 状态码 | 错误信息 | 描述 |
|--------|----------|------|
| 400 | invalid payload | 请求参数格式错误 |
| 401 | missing bearer token | 未提供认证令牌 |
| 404 | room not found | 房间不存在 |

---

### 建立连接

使用 Ticket 建立 WebSocket 连接。

```
ws://localhost:8080/ws?room_id=<room_id>
Subprotocol: chatroom.v1, ticket.<your_ticket>
```

**连接参数**

| 参数 | 方式 | 描述 |
|------|------|------|
| room_id | Query String | 房间 ID |
| ticket | Subprotocol | 通过 `/ws/tickets` 获取的 Ticket |

**JavaScript 示例**

```javascript
// 1. 先获取 ticket
const ticketResp = await fetch('/api/v1/ws/tickets', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ room_id: roomId })
})
const { ticket } = await ticketResp.json()

// 2. 建立 WebSocket 连接
const ws = new WebSocket(
  `ws://localhost:8080/ws?room_id=${roomId}`,
  ['chatroom.v1', `ticket.${ticket}`]
)
```

**连接生命周期**

```
1. 客户端发送连接请求（携带 Ticket）
2. 服务端验证 Ticket（有效性、房间匹配、未消费）
3. 服务端消费 Ticket，建立连接
4. 服务端广播 join 事件给房间内其他用户
5. 客户端开始收发消息
6. 断开时，服务端广播 leave 事件
```

---

### 消息格式

所有 WebSocket 消息使用 JSON 格式。

#### 客户端发送

**发送聊天消息**

```json
{
  "type": "message",
  "content": "Hello, everyone!"
}
```

| 字段 | 类型 | 约束 | 描述 |
|------|------|------|------|
| type | string | "message" | 消息类型 |
| content | string | 1-2000 字符 | 消息内容 |

**发送心跳**

```json
{
  "type": "ping"
}
```

**发送输入状态**

```json
{
  "type": "typing",
  "is_typing": true
}
```

---

#### 服务端推送

**聊天消息**

```json
{
  "type": "message",
  "id": 123,
  "room_id": 1,
  "user_id": 1,
  "username": "alice",
  "content": "Hello, everyone!",
  "created_at": "2025-01-08T10:00:00Z"
}
```

**用户加入**

```json
{
  "type": "join",
  "room_id": 1,
  "user_id": 2,
  "username": "bob",
  "online": 5
}
```

**用户离开**

```json
{
  "type": "leave",
  "room_id": 1,
  "user_id": 2,
  "username": "bob",
  "online": 4
}
```

**输入状态**

```json
{
  "type": "typing",
  "room_id": 1,
  "user_id": 1,
  "username": "alice",
  "is_typing": true
}
```

**心跳响应**

```json
{
  "type": "pong"
}
```

**错误消息**

```json
{
  "type": "error",
  "content": "消息长度不能超过2000字符"
}
```

---

### 心跳机制

| 方向 | 间隔 | 超时 | 说明 |
|------|------|------|------|
| 客户端 → 服务端 | 30 秒 | - | 发送 `ping` |
| 服务端 → 客户端 | - | 60 秒 | 等待 `ping`，超时断开 |
| 服务端 → 客户端 | 30 秒 | - | 发送 `Ping` 帧 |
| 客户端 → 服务端 | - | - | 响应 `Pong` 帧 |

---

## 健康检查

### 存活检查

```http
GET /health
```

**响应示例**

```json
{
  "status": "ok",
  "timestamp": "2025-01-08T10:00:00Z"
}
```

### 存活检查（Kubernetes 兼容）

```http
GET /healthz
```

**响应示例**

```json
{
  "status": "ok"
}
```

### 就绪检查

检查服务是否准备好接收流量（包括数据库连通性）。

```http
GET /ready
```

**响应示例**

```json
{
  "status": "ready",
  "checks": {
    "database": "healthy"
  }
}
```

**数据库不健康时**

```json
{
  "status": "not_ready",
  "checks": {
    "database": "unhealthy"
  }
}
```

### 版本信息

```http
GET /version
```

**响应示例**

```json
{
  "version": "v0.2.0",
  "git_commit": "abc1234",
  "build_time": "2025-01-08T10:00:00Z",
  "go_version": "go1.24"
}
```

---

## 指标

```http
GET /metrics
```

返回 Prometheus 格式的指标数据，包括：

| 指标名 | 类型 | 描述 |
|--------|------|------|
| `chat_ws_connections` | Gauge | 当前 WebSocket 连接数 |
| `chat_ws_messages_total` | Counter | 累计发送的消息数 |
| `http_requests_total` | Counter | HTTP 请求总数 |
| `http_request_duration_seconds` | Histogram | HTTP 请求延迟分布 |

---

## 错误处理

### 错误响应格式

所有错误响应使用统一格式：

```json
{
  "error": "error message"
}
```

### HTTP 状态码

| 状态码 | 描述 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未认证或认证失败 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 409 | 资源冲突 |
| 429 | 请求过于频繁 |
| 500 | 服务器内部错误 |

### 速率限制

API 请求受速率限制保护：

| 配置 | 值 |
|------|-----|
| 限制维度 | IP + 路径 |
| 速率 | 20 请求/秒 |
| 突发 | 40 请求 |

超出限制时返回 `429 Too Many Requests`。

---

## 配置参数

| 环境变量 | 默认值 | 描述 |
|----------|--------|------|
| `ACCESS_TOKEN_TTL_MINUTES` | 15 | Access Token 有效期（分钟） |
| `REFRESH_TOKEN_TTL_DAYS` | 7 | Refresh Token 有效期（天） |
| `WS_TICKET_TTL_SECONDS` | 60 | WebSocket Ticket 有效期（秒） |
