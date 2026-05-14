---
layout: home
---

# ChatRoom 技术白皮书

> 实时全栈系统架构参考实现

<div class="tech-badges">
  <span class="badge">Go 1.24</span>
  <span class="badge">React 19</span>
  <span class="badge">WebSocket</span>
  <span class="badge">PostgreSQL</span>
</div>

<div class="hero-subtitle">
一个教学导向的实时聊天室，展示现代全栈系统的核心设计模式
</div>

## 核心特性

<div class="feature-grid">
  <div class="feature-card">
    <h3>🔐 JWT 双 Token 认证</h3>
    <p>短期 Access Token + 长期 Refresh Token，自动轮换机制有效降低泄露风险</p>
  </div>
  <div class="feature-card">
    <h3>🎫 WebSocket Ticket 认证</h3>
    <p>一次性票据方案，通过 Subprotocol 传递，60秒有效期，防止重放攻击</p>
  </div>
  <div class="feature-card">
    <h3>🌐 分布式消息同步</h3>
    <p>基于 PostgreSQL LISTEN/NOTIFY 的跨实例广播，无需 Redis，保持架构简洁</p>
  </div>
  <div class="feature-card">
    <h3>📊 Prometheus 可观测性</h3>
    <p>内置连接数、吞吐量、延迟分布等指标，支持 Grafana 可视化</p>
  </div>
</div>

## 快速导航

<div class="nav-grid">
  <a href="/zh/whitepaper/" class="nav-card primary">
    <div class="nav-icon">📖</div>
    <div class="nav-title">白皮书</div>
    <div class="nav-desc">完整技术方案解析</div>
  </a>
  <a href="/zh/architecture/system" class="nav-card">
    <div class="nav-icon">🏗️</div>
    <div class="nav-title">架构概览</div>
    <div class="nav-desc">系统分层与组件交互</div>
  </a>
  <a href="/zh/tutorials/local-dev" class="nav-card">
    <div class="nav-icon">🚀</div>
    <div class="nav-title">快速开始</div>
    <div class="nav-desc">几分钟内启动项目</div>
  </a>
</div>

## 架构预览

```mermaid
flowchart TB
    subgraph Client["客户端层"]
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
    WSHub --> PG
    WSHub -.->|NOTIFY| WSHub
```

<style>
.tech-badges {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin: 1.5rem 0;
}

.badge {
  padding: 0.25rem 0.75rem;
  background: var(--vp-c-brand-soft);
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--vp-c-brand-1);
}

.hero-subtitle {
  text-align: center;
  color: var(--vp-c-text-2);
  margin-bottom: 2rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin: 2rem 0;
}

.feature-card {
  padding: 1.25rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.feature-card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: var(--vp-c-text-1);
}

.feature-card p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
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
  .feature-grid {
    grid-template-columns: 1fr;
  }
  .nav-grid {
    grid-template-columns: 1fr;
  }
}
</style>