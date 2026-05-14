---
layout: home
hero:
  name: ChatRoom
  text: 技术白皮书
  tagline: 一个教学导向的实时全栈系统架构参考实现
  image:
    src: /logo.svg
    alt: ChatRoom Logo
  actions:
    - theme: brand
      text: 架构概览
      link: /architecture/system
    - theme: alt
      text: 快速开始
      link: /getting-started
    - theme: alt
      text: GitHub
      link: https://github.com/LessUp/chatroom

features:
  - icon: 🔐
    title: JWT + Token Rotation
    details: 短期 Access Token（15分钟）+ 长期 Refresh Token（7天），每次刷新自动轮换，有效降低 Token 泄露风险。
  - icon: 🎫
    title: WebSocket Ticket 认证
    details: 一次性票据认证方案，Ticket 通过 WebSocket Subprotocol 传递，60秒有效期，使用后立即失效，防止重放攻击。
  - icon: 🌐
    title: 分布式消息同步
    details: 基于 PostgreSQL LISTEN/NOTIFY 的跨实例消息广播，无需引入 Redis 或消息队列，保持架构简洁。
  - icon: 📊
    title: Prometheus 可观测性
    details: 内置连接数、消息吞吐量、请求延迟分布等指标，支持 Grafana 可视化，Kubernetes 就绪检查。
  - icon: 🔄
    title: OpenSpec 工作流
    details: 规范化的变更管理流程，每个设计决策可追溯，specs 定义能力边界，changes 追踪演进历史。
  - icon: 🧪
    title: 完整测试覆盖
    details: 单元测试、集成测试、E2E 测试三层验证，Go race detector，前端 Vitest，确保代码质量。
---

## 技术栈

| 层级 | 技术选型 |
|------|----------|
| 后端 | Go 1.24, Gin, GORM, Gorilla WebSocket, zerolog |
| 前端 | React 19, TypeScript, Vite 7, Tailwind CSS v4 |
| 数据库 | PostgreSQL 16 |
| 可观测性 | Prometheus, Grafana |
| 部署 | Docker, Kubernetes, GitHub Actions |

## 架构预览

```mermaid
flowchart TB
    subgraph Client["客户端层"]
        B1[Browser<br/>React SPA]
        B2[Browser<br/>React SPA]
        B3[Browser<br/>React SPA]
    end

    subgraph App["应用层"]
        subgraph Gin["Gin HTTP Server"]
            REST[REST API<br/>Handlers]
            WS[WebSocket<br/>Handler]
            Static[静态文件]
        end
        
        subgraph Services["Service 层"]
            UserService[UserService]
            RoomService[RoomService]
            MsgService[MessageService]
        end
        
        subgraph WSHub["WebSocket Hub"]
            RoomHub1[RoomHub<br/>Room 1]
            RoomHub2[RoomHub<br/>Room 2]
        end
    end

    subgraph Data["数据层"]
        PG[(PostgreSQL 16<br/>users, rooms, messages<br/>refresh_tokens, ws_tickets)]
    end

    B1 & B2 & B3 -->|HTTP REST| REST
    B1 & B2 & B3 -->|WebSocket| WS
    
    REST --> UserService & RoomService & MsgService
    WS --> WSHub
    
    UserService & RoomService & MsgService --> PG
    WSHub --> PG
    WSHub -.->|NOTIFY| WSHub
```

## 文档导航

### 入门

- [快速开始](/getting-started) - 几分钟内启动完整系统
- [学习路径](/learning-path) - 循序渐进学习指南

### 架构深度

- [系统架构](/architecture/system) - 完整架构解析
- [数据流](/architecture/data-flow) - 请求与消息流转
- [数据模型](/architecture/data-model) - 数据库设计

### 设计决策 (ADR)

- [ADR-001: WebSocket 认证方案](/decisions/001-ws-auth) - 为什么选择 Ticket 方案
- [ADR-002: Token Rotation 策略](/decisions/002-token-rotation) - 双 Token 设计
- [ADR-003: 分布式消息同步](/decisions/003-distributed-sync) - Postgres NOTIFY 方案

### 技术深度

- [性能基准](/deep-dives/performance/benchmarks) - 吞吐量与延迟数据
- [威胁模型](/deep-dives/security/threat-model) - 安全分析与缓解措施
- [水平扩展](/deep-dives/scalability/horizontal) - 多实例部署设计

### API 参考

- [REST API](/api/rest) - 完整 API 文档
- [WebSocket 协议](/api/websocket) - 实时通信协议
