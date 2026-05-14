# REST API 文档

## 概述

ChatRoom 提供 RESTful API 用于认证和房间管理。

| 属性 | 值 |
|------|-----|
| Base URL | `http://localhost:8080` |
| API 前缀 | `/api/v1` |
| 认证方式 | Bearer Token (JWT) |
| 数据格式 | JSON |

## 认证

所有需要认证的接口都需要在请求头中携带 Bearer Token：

```
Authorization: Bearer <access_token>
```

### 注册

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

**错误响应**

| 状态码 | 错误信息 | 描述 |
|--------|----------|------|
| 400 | invalid payload | 请求参数格式错误 |
| 409 | username taken | 用户名已存在 |
| 429 | too many requests | 请求过于频繁 |

### 登录

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

### 刷新令牌

```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refresh_token": "string"
}
```

::: tip Token Rotation
每次刷新都会：
1. 验证旧 Refresh Token 的有效性
2. 撤销旧 Refresh Token
3. 签发新的 Access Token + Refresh Token 对
:::

## 房间

### 创建房间

```http
POST /api/v1/rooms
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "string"
}
```

### 获取房间列表

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
    }
  ]
}
```

### 获取房间消息

```http
GET /api/v1/rooms/:id/messages?limit=50&before_id=100
Authorization: Bearer <access_token>
```

| 参数 | 类型 | 默认值 | 约束 | 描述 |
|------|------|--------|------|------|
| limit | int | 50 | 1-200 | 返回消息数量 |
| before_id | int | - | > 0 | 获取此 ID 之前的消息（分页游标） |

## WebSocket Ticket

### 获取 Ticket

```http
POST /api/v1/ws/tickets
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "room_id": 1
}
```

**响应示例**

```json
{
  "ticket": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 60
}
```

## 健康检查

| 端点 | 用途 |
|------|------|
| `GET /health` | 存活检查 |
| `GET /healthz` | K8s 存活检查 |
| `GET /ready` | 就绪检查（含数据库连通性） |
| `GET /version` | 版本信息 |
| `GET /metrics` | Prometheus 指标 |

## 错误处理

所有错误响应使用统一格式：

```json
{
  "error": "error message"
}
```

| 状态码 | 描述 |
|--------|------|
| 400 | 请求参数错误 |
| 401 | 未认证或认证失败 |
| 409 | 资源冲突 |
| 429 | 请求过于频繁 |
| 500 | 服务器内部错误 |

## 速率限制

| 配置 | 值 |
|------|-----|
| 限制维度 | IP + 路径 |
| 速率 | 20 请求/秒 |
| 突发 | 40 请求 |

---

🌐 **Languages**: [English](/en/api/rest) | 简体中文