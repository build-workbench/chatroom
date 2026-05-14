# Deployment Architecture

This document describes ChatRoom's deployment options and architecture.

## Single Instance Deployment

```mermaid
flowchart LR
    subgraph Internet["Internet"]
        Users["Users"]
    end
    
    subgraph Host["Host"]
        Nginx["Nginx<br/>Reverse Proxy<br/>:80/:443"]
        App["ChatRoom App<br/>Go + React<br/>:8080"]
        PG["PostgreSQL<br/>:5432"]
        Mon["Prometheus<br/>+ Grafana<br/>:9090/:3000"]
    end
    
    Users -->|HTTPS| Nginx --> App --> PG
    Nginx -.->|Optional| Mon
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

## Kubernetes Deployment

```mermaid
flowchart TB
    subgraph K8s["Kubernetes Cluster"]
        Ingress["Ingress<br/>Nginx / TLS"]
        Service["Service<br/>ClusterIP :8080"]
        Config["ConfigMap<br/>+ Secret"]
        
        subgraph Deploy["Deployment (HPA)"]
            Pod1["Pod 1<br/>ChatRoom"]
            Pod2["Pod 2<br/>ChatRoom"]
            PodN["Pod N<br/>ChatRoom"]
        end
        
        subgraph DB["Data Layer"]
            PGStateful["PostgreSQL<br/>StatefulSet"]
        end
        
        subgraph Mon["Monitoring"]
            Prom["Prometheus"]
            Graf["Grafana"]
        end
    end
    
    Ingress --> Service --> Deploy --> PGStateful
    Config -.-> Deploy
    Deploy -.->|metrics| Prom --> Graf
```

### Key Kubernetes Resources

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

## Horizontal Scaling

### Implemented

1. **PostgreSQL NOTIFY**: Cross-instance message broadcast
2. **Session Persistence**: `ws_sessions` table stores online status
3. **Stateless API**: All instances share the same database

### Optional Optimizations

| Option | Description |
|--------|-------------|
| Sticky Sessions | Ensure WebSocket connections route to the same instance |
| Redis Session | Replace Postgres NOTIFY, higher throughput |
| Message Queue | Kafka/RabbitMQ for high message volume |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 8080 | HTTP listen port |
| `DATABASE_DSN` | - | Database connection string |
| `JWT_SECRET` | - | JWT signing secret (must be set in production) |
| `ENV` | dev | Runtime environment |
| `ACCESS_TOKEN_TTL_MINUTES` | 15 | Access Token validity period |
| `REFRESH_TOKEN_TTL_DAYS` | 7 | Refresh Token validity period |
| `WS_TICKET_TTL_SECONDS` | 60 | WebSocket Ticket validity period |
| `ALLOWED_ORIGINS` | - | CORS whitelist (comma-separated) |
| `POD_ID` | - | Instance identifier (distributed scenario) |

---

🌐 **Languages**: English | [简体中文](/zh/operations/deployment)
