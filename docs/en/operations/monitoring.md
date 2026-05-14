# Monitoring and Observability

This document describes ChatRoom's monitoring metrics and observability design.

## Prometheus Metrics

### Built-in Metrics

| Metric | Type | Description |
|--------|------|-------------|
| `chat_ws_connections` | Gauge | Current WebSocket connection count |
| `chat_ws_messages_total` | Counter | Cumulative message count |
| `http_requests_total` | Counter | Total HTTP requests |
| `http_request_duration_seconds` | Histogram | Request latency distribution |

### Accessing Metrics

```http
GET /metrics
```

Returns Prometheus-formatted metrics data.

## Grafana Dashboard

### Recommended Panels

1. **WebSocket Connections**: `chat_ws_connections`
2. **Message Throughput**: `rate(chat_ws_messages_total[5m])`
3. **Request Rate**: `rate(http_requests_total[5m])`
4. **P95 Latency**: `histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))`

### Example Dashboard Configuration

```json
{
  "panels": [
    {
      "title": "WebSocket Connections",
      "type": "gauge",
      "targets": [
        { "expr": "chat_ws_connections" }
      ]
    },
    {
      "title": "Message Rate",
      "type": "graph",
      "targets": [
        { "expr": "rate(chat_ws_messages_total[5m])" }
      ]
    },
    {
      "title": "Request Latency P95",
      "type": "graph",
      "targets": [
        { "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))" }
      ]
    }
  ]
}
```

## Health Checks

### Endpoints

| Endpoint | Purpose | K8s Usage |
|----------|---------|-----------|
| `/health` | Liveness check | livenessProbe |
| `/healthz` | K8s liveness check | livenessProbe |
| `/ready` | Readiness check | readinessProbe |
| `/version` | Version information | - |

### Kubernetes Configuration

```yaml
livenessProbe:
  httpGet:
    path: /healthz
    port: 8080
  initialDelaySeconds: 10
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 5
```

### Response Examples

**Liveness Check**

```json
{
  "status": "ok",
  "timestamp": "2025-01-08T10:00:00Z"
}
```

**Readiness Check**

```json
{
  "status": "ready",
  "checks": {
    "database": "healthy"
  }
}
```

## Logging

### Structured Logging

Using zerolog for JSON-formatted log output:

```json
{
  "level": "info",
  "time": "2025-01-08T10:00:00Z",
  "message": "user logged in",
  "user_id": 1,
  "username": "alice"
}
```

### Log Levels

| Level | Purpose |
|-------|---------|
| `debug` | Development debugging |
| `info` | Normal operations |
| `warn` | Potential issues |
| `error` | Errors |

### Configuration

```bash
LOG_LEVEL=info
LOG_FORMAT=json  # or console
```

## Alerting Rules

### Prometheus AlertManager Rule Examples

```yaml
groups:
  - name: chatroom
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status="500"}[5m]) > 0.1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: High error rate detected

      - alert: WebSocketConnectionsHigh
        expr: chat_ws_connections > 10000
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: WebSocket connections approaching limit
```

---

🌐 **Languages**: English | [简体中文](/en/operations/monitoring)
