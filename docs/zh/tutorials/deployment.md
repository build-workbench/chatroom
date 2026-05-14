# 部署架构

本文档描述 ChatRoom 的部署选项和架构。

## 单实例部署

```mermaid
flowchart LR
    subgraph Internet["互联网"]
        Users["用户"]
    end
    
    subgraph Host["主机"]
        Nginx["Nginx<br/>反向代理<br/>:80/:443"]
        App["ChatRoom App<br/>Go + React<br/>:8080"]
        PG["PostgreSQL<br/>:5432"]
        Mon["Prometheus<br/>+ Grafana<br/>:9090/:3000"]
    end
    
    Users -->|HTTPS| Nginx --> App --> PG
    Nginx -.->|可选| Mon
    App -.->|metrics| Mon
```

### Docker Compose

```yaml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: chatroom
      POSTGRES_USER: chatroom
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data

  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      DATABASE_DSN: postgres://chatroom:${DB_PASSWORD}@postgres:5432/chatroom
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - postgres

  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

volumes:
  pgdata:
```

## Kubernetes 部署

```mermaid
flowchart TB
    subgraph K8s["Kubernetes 集群"]
        Ingress["Ingress<br/>Nginx / TLS"]
        Service["Service<br/>ClusterIP :8080"]
        Config["ConfigMap<br/>+ Secret"]
        
        subgraph Deploy["Deployment (HPA)"]
            Pod1["Pod 1<br/>ChatRoom"]
            Pod2["Pod 2<br/>ChatRoom"]
            PodN["Pod N<br/>ChatRoom"]
        end
        
        subgraph DB["数据层"]
            PGStateful["PostgreSQL<br/>StatefulSet"]
        end
        
        subgraph Mon["监控"]
            Prom["Prometheus"]
            Graf["Grafana"]
        end
    end
    
    Ingress --> Service --> Deploy --> PGStateful
    Config -.-> Deploy
    Deploy -.->|metrics| Prom --> Graf
```

### 关键 Kubernetes 资源

```yaml
# Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: chatroom
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: chatroom
        image: chatroom:latest
        ports:
        - containerPort: 8080
        envFrom:
        - configMapRef:
            name: chatroom-config
        - secretRef:
            name: chatroom-secret
        livenessProbe:
          httpGet:
            path: /healthz
            port: 8080
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
```

## 水平扩展

### 已实现

1. **PostgreSQL NOTIFY**：跨实例消息广播
2. **会话持久化**：`ws_sessions` 表存储在线状态
3. **无状态 API**：所有实例共享同一数据库

### 可选优化

| 选项 | 说明 |
|------|------|
| Sticky Sessions | 确保 WebSocket 连接路由到同一实例 |
| Redis Session | 替代 Postgres NOTIFY，更高吞吐量 |
| 消息队列 | Kafka/RabbitMQ 处理高消息量 |

## 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `PORT` | 8080 | HTTP 监听端口 |
| `DATABASE_DSN` | - | 数据库连接串 |
| `JWT_SECRET` | - | JWT 签名密钥（生产必须设置） |
| `ENV` | dev | 运行环境 |
| `ACCESS_TOKEN_TTL_MINUTES` | 15 | Access Token 有效期 |
| `REFRESH_TOKEN_TTL_DAYS` | 7 | Refresh Token 有效期 |
| `WS_TICKET_TTL_SECONDS` | 60 | WebSocket Ticket 有效期 |
| `ALLOWED_ORIGINS` | - | CORS 白名单（逗号分隔） |
| `POD_ID` | - | 实例标识（分布式场景） |

---

🌐 **Languages**: [English](/en/operations/deployment) | 简体中文