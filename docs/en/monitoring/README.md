# ChatRoom Monitoring Guide

This guide covers using Prometheus and Grafana to monitor the ChatRoom application.

## Quick Start

### Start Monitoring Services

```bash
# Start full monitoring stack
docker compose --profile monitoring up -d
```

### Access URLs

- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3000 (admin/admin)
- **Application Metrics**: http://localhost:8080/metrics

## Available Metrics

### HTTP Metrics

| Metric Name | Type | Description |
|-------------|------|-------------|
| `http_requests_total` | Counter | Total HTTP requests |
| `http_request_duration_seconds` | Histogram | HTTP request latency |
| `http_requests_in_flight` | Gauge | Current requests being processed |

### WebSocket Metrics

| Metric Name | Type | Description |
|-------------|------|-------------|
| `chat_ws_connections` | Gauge | Current WebSocket connections |
| `chat_ws_messages_total` | Counter | Total WebSocket messages |

Note: The application exposes `chat_ws_connections` and `chat_ws_messages_total` for WebSocket monitoring.

### Business Metrics

Metrics related to application business logic:

| Metric Name | Type | Description |
|-------------|------|-------------|
| `chatroom_users_total` | Counter | Total registered users |
| `chatroom_rooms_total` | Counter | Total rooms created |
| `chatroom_messages_total` | Counter | Total messages sent |

Note: Custom business metrics can be added following the Prometheus client library patterns.

## Grafana Dashboard

### Import Dashboard

1. Login to Grafana (http://localhost:3000)
2. Navigate to Dashboards > Import
3. Upload `grafana-dashboard.json` file (if available in deploy/prometheus/)
4. Select Prometheus data source
5. Click Import

### Dashboard Panels

- **Overview**: Request volume, error rate, P99 latency
- **WebSocket**: Connection count, message throughput
- **System**: CPU, memory, Goroutine count

## Alert Rules

### Example Alert Rules

```yaml
groups:
  - name: chatroom
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"

      - alert: HighLatency
        expr: histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m])) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High latency detected"

      - alert: TooManyConnections
        expr: chat_ws_connections > 1000
        for: 1m
        labels:
          severity: warning
        annotations:
          summary: "Too many WebSocket connections"
```

## Common PromQL Queries

### Request Rate

```
rate(http_requests_total[5m])
```

### Error Rate

```
sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m]))
```

### P99 Latency

```
histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))
```

### WebSocket Connection Count

```
chat_ws_connections
```

### WebSocket Message Rate

```
rate(chat_ws_messages_total[5m])
```

## Troubleshooting

### Metrics Endpoint Not Responding

1. Check if application is running: `curl http://localhost:8080/health`
2. Check metrics endpoint: `curl http://localhost:8080/metrics`
3. Check Prometheus target status: http://localhost:9090/targets

### Grafana No Data

1. Confirm Prometheus datasource configuration is correct
2. Check if time range is correct
3. Verify PromQL query syntax

## Configuration Files

The monitoring stack configuration files are located in:

```
deploy/prometheus/
├── prometheus.yml      # Prometheus configuration
├── grafana-dashboard.json  # Grafana dashboard definition
└── alert-rules.yml     # Alert rules (optional)
```

### Prometheus Configuration Example

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'chatroom'
    static_configs:
      - targets: ['chatroom:8080']
    metrics_path: /metrics
```

## Further Reading

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Architecture Documentation](/en/architecture) — System metrics implementation details

---

🌐 **Languages**: English | [简体中文](/zh/monitoring/README)
