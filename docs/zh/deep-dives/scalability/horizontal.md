# 水平扩展

本文档描述 ChatRoom 的多实例部署设计和扩展策略。

## 当前架构

```mermaid
flowchart TB
    subgraph LB["负载均衡"]
        Nginx["Nginx / Ingress"]
    end
    
    subgraph Instances["应用实例"]
        subgraph A["实例 A"]
            HubA["RoomHub"]
            ClientsA["Clients"]
        end
        subgraph B["实例 B"]
            HubB["RoomHub"]
            ClientsB["Clients"]
        end
        subgraph C["实例 C"]
            HubC["RoomHub"]
            ClientsC["Clients"]
        end
    end
    
    subgraph Data["数据层"]
        PG["PostgreSQL"]
        subgraph Tables["共享数据"]
            Sessions["ws_sessions"]
            Messages["messages"]
            Tickets["ws_tickets"]
        end
    end
    
    Nginx --> A & B & C
    A & B & C --> PG --> Tables
    
    A <-.->|NOTIFY| A
    A <-.->|NOTIFY| B
    A <-.->|NOTIFY| C
    B <-.->|NOTIFY| A
    B <-.->|NOTIFY| C
    C <-.->|NOTIFY| A
    C <-.->|NOTIFY| B
```

## 跨实例消息同步

### 工作原理

每个应用实例：
1. **LISTEN** 到 PostgreSQL 的 `chatroom_ws_events` 通道
2. 发送消息时，**NOTIFY** 所有其他实例
3. 收到通知时，查找本地 RoomHub 并广播

```mermaid
sequenceDiagram
    participant ClientA as Client A<br/>(实例 A)
    participant InstanceA as 实例 A
    participant PG as PostgreSQL
    participant InstanceB as 实例 B
    participant InstanceC as 实例 C
    participant ClientB as Client B<br/>(实例 B)
    participant ClientC as Client C<br/>(实例 C)

    ClientA->>InstanceA: 发送消息
    InstanceA->>PG: INSERT 消息
    InstanceA->>InstanceA: 广播给本实例 Client
    
    InstanceA->>PG: NOTIFY chatroom_ws_events
    
    par 并行通知
        PG-->>InstanceA: LISTEN 回调 (忽略，已广播)
    and
        PG-->>InstanceB: LISTEN 回调
        InstanceB->>ClientB: 广播消息
    and
        PG-->>InstanceC: LISTEN 回调
        InstanceC->>ClientC: 广播消息
    end
```

### 通知 Payload 格式

```json
{
  "room_id": 1,
  "data": {
    "type": "message",
    "id": 123,
    "content": "Hello!",
    "username": "alice"
  }
}
```

## 分布式在线状态

### 会话管理

```mermaid
flowchart TB
    subgraph InstanceA["实例 A"]
        CA1["Client 1<br/>Room 1"]
        CA2["Client 2<br/>Room 1"]
        CA3["Client 3<br/>Room 2"]
    end
    
    subgraph InstanceB["实例 B"]
        CB1["Client 4<br/>Room 1"]
        CB2["Client 5<br/>Room 2"]
    end
    
    subgraph DB["ws_sessions 表"]
        S1["session_1: Room 1, User 1, Pod A"]
        S2["session_2: Room 1, User 2, Pod A"]
        S3["session_3: Room 2, User 3, Pod A"]
        S4["session_4: Room 1, User 4, Pod B"]
        S5["session_5: Room 2, User 5, Pod B"]
    end
    
    CA1 & CA2 & CA3 --> S1 & S2 & S3
    CB1 & CB2 --> S4 & S5
```

### 在线人数查询

```sql
-- 查询 Room 1 的在线人数（聚合所有实例）
SELECT COUNT(DISTINCT user_id) 
FROM ws_sessions 
WHERE room_id = 1 
  AND last_seen_at > NOW() - INTERVAL '45 seconds';
```

## 负载均衡策略

### WebSocket 连接路由

| 策略 | 说明 | 优缺点 |
|------|------|--------|
| **Round Robin** | 轮询分配 | 简单，但可能不均匀 |
| **Least Connections** | 分配到连接数最少的实例 | 推荐，分布更均匀 |
| **Sticky Sessions** | 同一用户路由到同一实例 | 减少跨实例通信，但限制故障转移 |

### 推荐：Least Connections

```
upstream chatroom {
    least_conn;
    server 10.0.0.1:8080;
    server 10.0.0.2:8080;
    server 10.0.0.3:8080;
}
```

## 扩展点

### 当前已实现

1. **PostgreSQL NOTIFY**：跨实例消息广播
2. **ws_sessions 表**：分布式在线状态
3. **无状态 API**：所有实例共享同一数据库
4. **PodID 标识**：每个实例有唯一标识

### 未来扩展

| 扩展方向 | 实现思路 | 复杂度 |
|----------|----------|--------|
| Redis Pub/Sub | 替换 Postgres NOTIFY，更高吞吐 | 中 |
| 消息持久化 | Kafka 处理消息流 | 高 |
| 私密房间 | rooms 表添加 visibility 字段 | 低 |
| 消息搜索 | Elasticsearch 全文索引 | 中 |
| 文件上传 | 对象存储 + 预签名 URL | 中 |
| 端到端加密 | Signal Protocol | 极高 |

---

🌐 **Languages**: [English](/en/deep-dives/scalability/horizontal) | 简体中文