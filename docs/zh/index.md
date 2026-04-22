---
layout: home
hero:
  name: ChatRoom 文档
  text: ''
  tagline: 用实战项目学会全栈开发 — Go + React + WebSocket
  image:
    src: /logo.svg
    alt: ChatRoom Logo
  actions:
    - theme: brand
      text: 快速开始
      link: /zh/getting-started
    - theme: alt
      text: 学习路径
      link: /zh/learning-path
    - theme: alt
      text: GitHub
      link: https://github.com/LessUp/chatroom
---

## 核心特性

| 特性 | 描述 |
|------|------|
| 🚀 **5 分钟启动** | Docker Compose 一键启动，热重载开发 |
| 🔐 **JWT 双 Token** | Access + Refresh Token 完整实现 |
| ⚡ **WebSocket 实时** | 房间级广播、在线状态、心跳保活 |
| 📊 **Prometheus 监控** | 内置指标，配套 Grafana 仪表盘 |
| 🧪 **测试完备** | Go 单元/集成测试，前端 Vitest 测试 |
| 📦 **生产就绪** | Docker 多阶段构建，K8s 部署清单 |

## 快速开始

```bash
# 克隆项目
git clone https://github.com/LessUp/chatroom.git
cd chatroom

# 启动 PostgreSQL
docker compose up -d postgres

# 启动后端
go run ./cmd/server

# 启动前端（另一终端）
npm --prefix frontend install
npm --prefix frontend run dev
```

访问 http://localhost:5173 开始体验！

## 文档导航

- [快速开始](./getting-started) — 项目启动与环境配置
- [学习路径](./learning-path) — 后端/前端/全栈学习路径
- [API 文档](./api) — REST + WebSocket 接口
- [架构文档](./architecture) — 系统分层与数据流
- [设计文档](./design) — 设计决策与扩展方向
- [监控指南](./monitoring/README) — Prometheus + Grafana 配置
- [常见问题](./faq) — 问题解答

---

🔗 [English Documentation](/en/) | [返回门户页](/)
