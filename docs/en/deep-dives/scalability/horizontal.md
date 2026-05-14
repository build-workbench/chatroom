# Horizontal Scaling

This document describes ChatRoom's multi-instance deployment design and scaling strategies.

## Current Architecture

```mermaid
flowchart TB
    subgraph LB["Load Balancer"]
        Nginx["Nginx / Ingress"]
    end
    
    subgraph Instances["Application Instances"]
        subgraph A["Instance A"]
            HubA["RoomHub"]
            ClientsA["Clients"]
        end
        subgraph B["Instance B"]
            HubB["RoomHub"]
            ClientsB["Clients"]
        end
        subgraph C["Instance C"]
            HubC["RoomHub"]
            ClientsC["Clients"]
        end
    end
    
    subgraph Data["Data Layer"]
        PG["PostgreSQL"]
        subgraph Tables["Shared Data"]
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

## Cross-Instance Message Synchronization

### How It Works

Each application instance:
1. **LISTEN** to PostgreSQL's `chatroom_ws_events` channel
2. When sending a message, **NOTIFY** all other instances
3. When receiving a notification, find local RoomHub and broadcast

```mermaid
sequenceDiagram
    participant ClientA as Client A<br/>(Instance A)
    participant InstanceA as Instance A
    participant PG as PostgreSQL
    participant InstanceB as Instance B
    participant InstanceC as Instance C
    participant ClientB as Client B<br/>(Instance B)
    participant ClientC as Client C<br/>(Instance C)

    ClientA->>InstanceA: Send Message
    InstanceA->>PG: INSERT Message
    InstanceA->>InstanceA: Broadcast to local Clients
    
    InstanceA->>PG: NOTIFY chatroom_ws_events
    
    par Parallel Notifications
        PG-->>InstanceA: LISTEN callback (ignore, already broadcast)
    and
        PG-->>InstanceB: LISTEN callback
        InstanceB->>ClientB: Broadcast Message
    and
        PG-->>InstanceC: LISTEN callback
        InstanceC->>ClientC: Broadcast Message
    end
```

### Notification Payload Format

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

## Distributed Online Status

### Session Management

```mermaid
flowchart TB
    subgraph InstanceA["Instance A"]
        CA1["Client 1<br/>Room 1"]
        CA2["Client 2<br/>Room 1"]
        CA3["Client 3<br/>Room 2"]
    end
    
    subgraph InstanceB["Instance B"]
        CB1["Client 4<br/>Room 1"]
        CB2["Client 5<br/>Room 2"]
    end
    
    subgraph DB["ws_sessions Table"]
        S1["session_1: Room 1, User 1, Pod A"]
        S2["session_2: Room 1, User 2, Pod A"]
        S3["session_3: Room 2, User 3, Pod A"]
        S4["session_4: Room 1, User 4, Pod B"]
        S5["session_5: Room 2, User 5, Pod B"]
    end
    
    CA1 & CA2 & CA3 --> S1 & S2 & S3
    CB1 & CB2 --> S4 & S5
```

### Online User Count Query

```sql
-- Query online user count for Room 1 (aggregated across all instances)
SELECT COUNT(DISTINCT user_id) 
FROM ws_sessions 
WHERE room_id = 1 
  AND last_seen_at > NOW() - INTERVAL '45 seconds';
```

## Load Balancing Strategy

### WebSocket Connection Routing

| Strategy | Description | Pros & Cons |
|----------|-------------|-------------|
| **Round Robin** | Rotate distribution | Simple, but may be uneven |
| **Least Connections** | Route to instance with fewest connections | Recommended, more even distribution |
| **Sticky Sessions** | Route same user to same instance | Reduces cross-instance communication, but limits failover |

### Recommendation: Least Connections

```
upstream chatroom {
    least_conn;
    server 10.0.0.1:8080;
    server 10.0.0.2:8080;
    server 10.0.0.3:8080;
}
```

## Extension Points

### Currently Implemented

1. **PostgreSQL NOTIFY**: Cross-instance message broadcast
2. **ws_sessions Table**: Distributed online status
3. **Stateless API**: All instances share the same database
4. **PodID Identifier**: Each instance has unique identifier

### Future Extensions

| Extension Direction | Implementation Approach | Complexity |
|---------------------|------------------------|------------|
| Redis Pub/Sub | Replace Postgres NOTIFY, higher throughput | Medium |
| Message Persistence | Kafka for message stream | High |
| Private Rooms | Add visibility field to rooms table | Low |
| Message Search | Elasticsearch full-text indexing | Medium |
| File Upload | Object storage + presigned URLs | Medium |
| End-to-End Encryption | Signal Protocol | Very High |

---

🌐 **Languages**: English | [简体中文](/en/deep-dives/scalability/horizontal)
