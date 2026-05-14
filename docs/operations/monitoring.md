# 监控与可观测性

本文档描述 ChatRoom 的监控指标和可观测性设计。

## Prometheus 指标

### 内置指标

| 指标 | 类型 | 描述 |
|------|------|------|
| `chat_ws_connections` | Gauge | 当前 WebSocket 连接数 |
| `chat_ws_messages_total` | Counter | 累计消息数 |
| `http_requests_total` | Counter | HTTP 请求总数 |
| `http_request_duration_seconds` | Histogram | 请求延迟分布 |

### 访问指标

```http
GET /metrics
```

返回 Prometheus 格式的指标数据。

## Grafana 仪表盘

### 推荐 Panel

1. **WebSocket 连接数**：`chat_ws_connections`
2. **消息吞吐量**：`rate(chat_ws_messages_total[5m])`
3. **请求速率**：`rate(http_requests_total[5m])`
4. **P95 延迟**：`histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))`

### 示例仪表盘配置

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

## 健康检查

### 端点

| 端点 | 用途 | K8s 用法 |
|------|------|----------|
| `/health` | 存活检查 | livenessProbe |
| `/healthz` | K8s 存活检查 | livenessProbe |
| `/ready` | 就绪检查 | readinessProbe |
| `/version` | 版本信息 | - |

### Kubernetes 配置

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

### 响应示例

**存活检查**

```json
{
  "status": "ok",
  "timestamp": "2025-01-08T10:00:00Z"
}
```

**就绪检查**

```json
{
  "status": "ready",
  "checks": {
    "database": "healthy"
  }
}
```

## 日志

### 结构化日志

使用 zerolog 输出 JSON 格式日志：

```json
{
  "level": "info",
  "time": "2025-01-08T10:00:00Z",
  "message": "user logged in",
  "user_id": 1,
  "username": "alice"
}
```

### 日志级别

| 级别 | 用途 |
|------|------|
| `debug` | 开发调试 |
| `info` | 正常操作 |
| `warn` | 潜在问题 |
| `error` | 错误 |

### 配置

```bash
LOG_LEVEL=info
LOG_FORMAT=json  # 或 console
```

## 告警规则

### Prometheus AlertManager 规则示例

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

🌐 **Languages**: [English](/en/operations/monitoring) | 简体中文