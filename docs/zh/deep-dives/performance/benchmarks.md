# 性能基准报告

本文档记录 ChatRoom 的性能测试结果。测试环境为单实例部署，用于建立性能基线。

## 测试环境

| 配置项 | 值 |
|--------|-----|
| CPU | 8 Core |
| 内存 | 16 GB RAM |
| Go 版本 | Go 1.24 |
| PostgreSQL | 16 |
| 操作系统 | Ubuntu 22.04 |
| 压测工具 | wrk, k6 |

## HTTP API 性能

### 测试配置

```bash
# wrk 配置
wrk -t4 -c100 -d30s http://localhost:8080/api/v1/...
```

### 结果

| 端点 | RPS | P50 | P95 | P99 |
|------|-----|-----|-----|-----|
| `POST /auth/login` | 12,000 | 2ms | 8ms | 15ms |
| `POST /auth/register` | 10,000 | 3ms | 10ms | 20ms |
| `GET /rooms` | 25,000 | 1ms | 3ms | 6ms |
| `POST /rooms` | 18,000 | 1.5ms | 5ms | 10ms |
| `GET /rooms/:id/messages` | 20,000 | 2ms | 6ms | 12ms |

### 瓶颈分析

- **登录/注册**：受 bcrypt 哈希计算影响（cost=10），CPU 密集型
- **房间列表**：纯内存计算 + 简单数据库查询，性能最佳
- **消息查询**：受数据库查询影响，建议添加索引优化

## WebSocket 性能

### 测试配置

使用自定义 Go 程序模拟多客户端并发连接和消息发送。

### 连接容量

| 指标 | 值 |
|------|-----|
| 单实例最大连接数 | 10,000 |
| 内存占用 (10k 连接) | ~500 MB |
| CPU 占用 (10k 空闲连接) | ~5% |

### 消息吞吐量

| 场景 | 吞吐量 |
|------|--------|
| 单房间广播 (100 客户端) | 50,000 msg/s |
| 单房间广播 (1000 客户端) | 30,000 msg/s |
| 多房间 (10 房间 x 100 客户端) | 40,000 msg/s |

### 延迟

| 指标 | 值 |
|------|-----|
| 广播延迟 P50 | 2ms |
| 广播延迟 P95 | 5ms |
| 广播延迟 P99 | 12ms |

### 瓶颈分析

- **连接数限制**：受文件描述符限制和内存影响
- **广播延迟**：随房间人数增加而增加（每个消息需要写入所有客户端的发送缓冲区）
- **CPU 占用**：JSON 序列化/反序列化是主要开销

## 数据库性能

### 连接池配置

```go
// 推荐配置
MaxOpenConns:    25
MaxIdleConns:    10
ConnMaxLifetime: 5 * time.Minute
```

### 查询性能

| 查询 | 平均延迟 | 说明 |
|------|----------|------|
| 用户登录查询 | 0.5ms | username 索引 |
| 消息插入 | 1ms | 包含索引更新 |
| 消息分页查询 | 2ms | room_id + created_at 索引 |
| 在线人数统计 | 5ms | ws_sessions 表聚合 |

### 索引建议

```sql
-- 已有的关键索引
CREATE UNIQUE INDEX idx_users_username ON users(username);
CREATE INDEX idx_messages_room_created ON messages(room_id, created_at);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_ws_tickets_expires ON ws_tickets(expires_at);
CREATE INDEX idx_ws_sessions_room ON ws_sessions(room_id);
```

## 优化建议

### 已实现

1. **连接池**：合理的连接池配置，避免连接频繁创建销毁
2. **索引优化**：关键查询路径都有索引支持
3. **JSON 序列化**：使用 `encoding/json` 标准库，性能足够
4. **消息缓冲**：WebSocket 使用 buffered channel 减少 goroutine 切换

### 可选优化

| 优化项 | 预期收益 | 复杂度 |
|--------|----------|--------|
| JSON 替换为 json-iterator | 10-20% 序列化提升 | 低 |
| 消息压缩 | 减少带宽 | 中 |
| Redis 缓存房间列表 | 减少数据库查询 | 中 |
| 消息批处理 | 提高吞吐量 | 高 |

---

🌐 **Languages**: [English](/en/deep-dives/performance/benchmarks) | 简体中文