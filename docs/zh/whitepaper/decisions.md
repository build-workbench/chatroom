# 关键决策

本文档索引所有架构决策记录（ADR），并提供每个决策的简要摘要。

## 决策索引

| ADR | 标题 | 状态 | 日期 |
|-----|------|------|------|
| [ADR-001](/zh/decisions/001-ws-auth) | WebSocket 认证方案 | ✅ 已采纳 | 2025-01 |
| [ADR-002](/zh/decisions/002-token-rotation) | Token Rotation 策略 | ✅ 已采纳 | 2025-01 |
| [ADR-003](/zh/decisions/003-distributed-sync) | 分布式消息同步 | ✅ 已采纳 | 2025-02 |

## 决策摘要

### ADR-001: WebSocket 认证方案

**问题**：WebSocket 协议不支持 HTTP Authorization 头，如何安全认证？

**决策**：采用一次性 Ticket 方案

```
1. 客户端通过 REST API 获取 Ticket
2. Ticket 通过 WebSocket Subprotocol 传递
3. 服务端验证并立即消费 Ticket
4. 建立长连接
```

**理由**：
- 避免 Token 暴露在 URL
- Ticket 一次性使用，防止重放
- 与房间绑定，防止跨房间滥用

---

### ADR-002: Token Rotation 策略

**问题**：如何平衡 Token 安全性和用户体验？

**决策**：双 Token + 自动轮换

```
Access Token: 15 分钟有效期
Refresh Token: 7 天有效期，每次使用后轮换
```

**理由**：
- Access Token 泄露影响有限
- Refresh Token 轮换机制可检测盗用
- 用户无感知自动刷新

---

### ADR-003: 分布式消息同步

**问题**：多实例部署时，WebSocket 消息如何跨实例同步？

**决策**：PostgreSQL LISTEN/NOTIFY

```sql
-- 发布消息
NOTIFY 'room:123', '{"type":"message",...}'

-- 订阅消息
LISTEN 'room:123'
```

**理由**：
- 无需引入 Redis
- 与数据库事务原子性
- 自动清理（连接断开自动 UNLISTEN）

**限制**：
- 单条消息最大 8000 字节
- 不保证顺序（需应用层处理）

---

## 决策模板

新决策请遵循以下模板：

```markdown
# ADR-NNN: 决策标题

## 状态
[提议中 | 已采纳 | 已废弃 | 已替代]

## 背景
描述问题背景和约束条件

## 决策
描述做出的决策

## 理由
解释为什么做出这个决策

## 后果
描述决策带来的影响（正面和负面）
```

---

## 参与决策

有新的架构决策想法？请：

1. 阅读 [贡献指南](https://github.com/LessUp/chatroom/blob/master/CONTRIBUTING.md)
2. 创建 Issue 讨论
3. 提交 ADR 文档

---

🌐 **Languages**: [English](/en/whitepaper/decisions) | 简体中文
