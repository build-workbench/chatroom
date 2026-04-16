# RFC: Observability and Monitoring

> **Status**: implemented
> **Created**: 2026-03-08
> **Updated**: 2026-04-17
> **Related**: [Open Source Standards](../product/open-source-standards.md) (R10)

This RFC defines the observability and monitoring specifications for the ChatRoom project.

---

## Overview

Prometheus metrics, structured logging, and health check endpoints for application observability.

---

## Metrics

### Prometheus Endpoint

**URL**: `/metrics`

**Implementation**: `internal/metrics/`

### Exposed Metrics

| Metric | Type | Description |
|--------|------|-------------|
| `http_requests_total` | Counter | Total HTTP requests by path and method |
| `http_request_duration_seconds` | Histogram | Request duration distribution |
| `websocket_connections_active` | Gauge | Active WebSocket connections |
| `websocket_messages_total` | Counter | Messages broadcast by room |
| `auth_logins_total` | Counter | Total login attempts |
| `db_query_duration_seconds` | Histogram | Database query duration |

### Metrics Registration

```go
import "github.com/prometheus/client_golang/prometheus"

var (
    activeConnections = prometheus.NewGauge(prometheus.GaugeOpts{
        Name: "websocket_connections_active",
        Help: "Current active WebSocket connections",
    })
    messagesTotal = prometheus.NewCounterVec(prometheus.CounterOpts{
        Name: "websocket_messages_total",
        Help: "Total messages broadcast",
    }, []string{"room"})
)
```

---

## Logging

### Log Configuration

| Variable | Values | Default |
|----------|--------|---------|
| `LOG_LEVEL` | trace, debug, info, warn, error, fatal | `info` |
| `LOG_FORMAT` | console, json | `console` |

### Structured Logging

**Production format** (`LOG_FORMAT=json`):

```json
{
  "level": "info",
  "time": "2026-04-17T10:30:00Z",
  "msg": "User login successful",
  "username": "alice",
  "duration_ms": 45
}
```

**Development format** (`LOG_FORMAT=console`):

```
INFO  2026-04-17T10:30:00Z  User login successful  username=alice duration_ms=45
```

### Log Levels

| Level | Usage |
|-------|-------|
| `TRACE` | Detailed debugging, message flow |
| `DEBUG` | Development debugging |
| `INFO` | Significant events (login, connection) |
| `WARN` | Warnings (rate limit approaching, deprecated usage) |
| `ERROR` | Errors (failed authentication, database errors) |
| `FATAL` | Fatal errors (startup failures, unrecoverable errors) |

---

## Health Checks

### Endpoints

| Endpoint | Purpose | Check | Response |
|----------|---------|-------|----------|
| `/health` | Liveness | Application running | `{"status": "ok"}` |
| `/healthz` | Kubernetes liveness | Same as `/health` | `{"status": "ok"}` |
| `/ready` | Readiness | Application + database | `{"status": "ready", "checks": {"database": "ok"}}` |

### Readiness Check Implementation

```go
func readinessHandler(c *gin.Context) {
    checks := map[string]string{}
    status := "ready"
    code := http.StatusOK

    // Check database
    if err := db.Ping(); err != nil {
        checks["database"] = "error"
        status = "not_ready"
        code = http.StatusServiceUnavailable
    } else {
        checks["database"] = "ok"
    }

    c.JSON(code, gin.H{"status": status, "checks": checks})
}
```

---

## Grafana Dashboard

### Location

`docs/monitoring/` contains sample Grafana dashboard JSON.

### Dashboard Panels

| Panel | Metric | Visualization |
|-------|--------|---------------|
| Active Connections | `websocket_connections_active` | Gauge |
| Request Rate | `rate(http_requests_total[5m])` | Time series |
| Request Duration | `histogram_quantile(http_request_duration_seconds)` | Heatmap |
| Message Throughput | `rate(websocket_messages_total[1m])` | Time series |
| Login Success Rate | `rate(auth_logins_total{success="true"}[5m])` | Time series |
| Database Query Duration | `db_query_duration_seconds` | Histogram |

### Import Dashboard

1. Open Grafana UI
2. Import dashboard from `docs/monitoring/chatroom-dashboard.json`
3. Configure Prometheus data source
4. Adjust thresholds as needed

---

## Alerting

### Recommended Alerts

| Alert | Condition | Severity |
|-------|-----------|----------|
| High Error Rate | `rate(http_requests_total{status=~"5.."}[5m]) > 0.05` | Critical |
| No Active Connections | `websocket_connections_active == 0` (for 5m) | Warning |
| Database Down | Readiness check failing | Critical |
| High Latency | `p95(http_request_duration_seconds) > 1s` | Warning |

---

## Observability in Development

### Local Monitoring Stack

```bash
# Start with monitoring profile
docker compose --profile monitoring up -d

# Services started:
# - chatroom app
# - postgres
# - prometheus
# - grafana
```

### Access

| Service | URL |
|---------|-----|
| Application | http://localhost:8080 |
| Metrics | http://localhost:8080/metrics |
| Prometheus | http://localhost:9090 |
| Grafana | http://localhost:3000 |

---

## Change History

| Date | Change |
|------|--------|
| 2026-03-08 | Initial observability spec documented (Chinese) |
| 2026-04-17 | Migrated to SDD structure, translated to English |
