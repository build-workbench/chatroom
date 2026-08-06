---
layout: home
---

# ChatRoom

> 一个面向教学的实时聊天室：Go + React + PostgreSQL + WebSocket

<div class="hero-subtitle">
展示如何把认证、房间、消息、WebSocket 组合成一个可运行、可理解的全栈系统
</div>

## 核心特性

- **JWT 双 Token 认证**：短期 Access Token + 长期 Refresh Token，自动轮换
- **WebSocket Ticket 认证**：一次性票据，通过 Subprotocol 传递，防止重放
- **房间级实时广播**：每个房间一个 RoomHub goroutine，连接与消息隔离
- **消息持久化**：聊天记录存入 PostgreSQL，支持分页加载历史

## 快速导航

<div class="nav-grid">
  <a href="/tutorials/local-dev" class="nav-card primary">
    <div class="nav-icon">🚀</div>
    <div class="nav-title">快速开始</div>
    <div class="nav-desc">几分钟内启动项目</div>
  </a>
  <a href="/architecture/system" class="nav-card">
    <div class="nav-icon">🏗️</div>
    <div class="nav-title">系统架构</div>
    <div class="nav-desc">分层与组件交互</div>
  </a>
  <a href="/api/rest" class="nav-card">
    <div class="nav-icon">🔌</div>
    <div class="nav-title">API 参考</div>
    <div class="nav-desc">REST 与 WebSocket 协议</div>
  </a>
</div>

## 架构预览

```mermaid
flowchart TB
    subgraph Client["客户端"]
        B1[Browser<br/>React SPA]
        B2[Browser<br/>React SPA]
    end

    subgraph App["应用层"]
        subgraph Gin["Gin HTTP Server"]
            REST[REST API]
            WS[WebSocket]
        end
        subgraph Services["Service 层"]
            UserService[UserService]
            RoomService[RoomService]
            MsgService[MessageService]
        end
        subgraph WSHub["WebSocket Hub"]
            RoomHub[RoomHub]
        end
    end

    subgraph Data["数据层"]
        PG[(PostgreSQL 16)]
    end

    B1 & B2 -->|HTTP REST| REST
    B1 & B2 -->|WebSocket| WS
    REST --> UserService & RoomService & MsgService
    WS --> WSHub
    UserService & RoomService & MsgService --> PG
```

<style>
.hero-subtitle {
  text-align: center;
  color: var(--vp-c-text-2);
  margin-bottom: 2rem;
}

.nav-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin: 2rem 0;
}

.nav-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  text-decoration: none;
  color: var(--vp-c-text-1);
  transition: all 0.3s ease;
}

.nav-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
}

.nav-card.primary {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.nav-icon {
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

.nav-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.nav-desc {
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
}

@media (max-width: 768px) {
  .nav-grid {
    grid-template-columns: 1fr;
  }
}
</style>
