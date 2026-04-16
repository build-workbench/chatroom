# RFC: Containerization Strategy

> **Status**: implemented
> **Created**: 2026-03-08
> **Updated**: 2026-04-17
> **Related**: [Open Source Standards](../product/open-source-standards.md) (R6)

This RFC defines the containerization and deployment strategy for the ChatRoom project.

---

## Overview

Multi-stage Docker builds and deployment configurations for Docker Compose and Kubernetes.

---

## Docker Architecture

### Multi-Stage Dockerfile

```dockerfile
# Stage 1: Frontend build
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Backend build
FROM golang:1.24-alpine AS backend-builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -ldflags="-X main.Version=${VERSION}" -o /app/bin/server ./cmd/server

# Stage 3: Production runtime
FROM alpine:3.21
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app
COPY --from=backend-builder /app/bin/server ./
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist
RUN chown -R app:app /app
USER app
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:8080/health || exit 1
CMD ["./server"]
```

### Build Optimization

- **Layer caching**: Dependencies cached before source copy
- **Minimal base images**: Alpine-based images
- **Non-root user**: Security best practice
- **Health checks**: Built-in health check instruction

---

## Docker Compose

### Services

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - DATABASE_DSN=postgres://chatroom:chatroom@postgres:5432/chatroom?sslmode=disable
      - JWT_SECRET=dev-secret-change-me
    depends_on:
      postgres:
        condition: service_healthy

  postgres:
    image: postgres:16
    environment:
      - POSTGRES_USER=chatroom
      - POSTGRES_PASSWORD=chatroom
      - POSTGRES_DB=chatroom
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U chatroom"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

---

## Kubernetes Deployment

### Components

| File | Purpose |
|------|---------|
| `deployment.yaml` | Application deployment, replicas, rolling updates |
| `service.yaml` | Service exposure (ClusterIP, LoadBalancer) |
| `configmap.yaml` | Non-sensitive configuration |
| `secret.yaml` | Sensitive configuration (JWT secret, DB credentials) |
| `ingress.yaml` | Ingress routing (optional) |

### Deployment Manifest

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: chatroom
spec:
  replicas: 2
  selector:
    matchLabels:
      app: chatroom
  template:
    metadata:
      labels:
        app: chatroom
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
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 10
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 30
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "500m"
```

---

## Health Check Endpoints

| Endpoint | Purpose | Response |
|----------|---------|----------|
| `/health` | Liveness check | `{"status": "ok"}` (HTTP 200) |
| `/healthz` | Kubernetes liveness | `{"status": "ok"}` (HTTP 200) |
| `/ready` | Readiness check (includes DB) | `{"status": "ready", "checks": {...}}` (HTTP 200) |
| `/version` | Version information | `{"version": "v0.2.0", "git_commit": "...", "build_time": "..."}` |

---

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `APP_PORT` | Application port | `8080` |
| `DATABASE_DSN` | Database connection string | `postgres://user:pass@host:5432/db` |
| `JWT_SECRET` | JWT signing secret | `<random-string>` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `APP_ENV` | Environment (dev/prod) | `dev` |
| `ACCESS_TOKEN_TTL_MINUTES` | Access token TTL | `15` |
| `REFRESH_TOKEN_TTL_DAYS` | Refresh token TTL | `7` |
| `LOG_LEVEL` | Log level | `info` |
| `LOG_FORMAT` | Log format (console/json) | `console` |
| `ALLOWED_ORIGINS` | CORS allowed origins | `*` |

**Template**: `.env.example` provides a template for local development.

---

## Change History

| Date | Change |
|------|--------|
| 2026-03-08 | Initial containerization design documented (Chinese) |
| 2026-04-17 | Migrated to SDD structure, translated to English |
