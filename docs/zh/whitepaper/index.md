# 执行摘要

ChatRoom 是一个教学导向的实时聊天室项目，旨在展示现代全栈系统的核心设计模式。

## 项目背景

在学习和教学过程中，我们发现缺少一个既能快速运行、又具备生产级工程实践的示例项目。大多数教程项目要么过于简单，要么架构陈旧。

ChatRoom 应运而生，它的设计原则是：

- **快速可运行**：几分钟内启动完整系统
- **文档与代码一致**：所见即所得
- **测试可验证**：完整的测试覆盖
- **结构清晰易懂**：便于讲解和学习

## 核心价值

### 1. 真实的全栈架构

```
React SPA ←→ Gin HTTP Server ←→ PostgreSQL
     ↓              ↓
  WebSocket    REST API
```

不是"Hello World"，而是完整的用户认证、实时通信、数据持久化流程。

### 2. 生产级工程实践

| 实践 | 实现 |
|------|------|
| 认证 | JWT 双 Token + 自动轮换 |
| 实时通信 | WebSocket + 房间广播 |
| 分布式 | PostgreSQL LISTEN/NOTIFY |
| 可观测性 | Prometheus 指标 |
| CI/CD | GitHub Actions |
| 部署 | Docker + Kubernetes |

### 3. 教学优先设计

- 每个设计决策都有 ADR 记录
- 代码注释详尽
- 渐进式学习路径

## 目标读者

- **后端开发者**：学习 Go、WebSocket、JWT 认证
- **前端开发者**：学习 React Hooks、实时 UI
- **全栈开发者**：理解前后端协作
- **教学者**：用作教学示例

## 快速开始

```bash
# 启动数据库
docker compose up -d postgres

# 启动后端
go run ./cmd/server

# 启动前端（另一终端）
npm --prefix frontend run dev
```

访问 http://localhost:5173 开始体验。

## 文档导航

| 模块 | 内容 |
|------|------|
| [问题陈述](/zh/whitepaper/problem) | 实时系统的核心挑战 |
| [方案概述](/zh/whitepaper/solution) | 架构设计哲学与选型 |
| [技术架构](/zh/whitepaper/architecture) | 三层架构详解 |
| [关键决策](/zh/whitepaper/decisions) | ADR 索引 |

---

🌐 **Languages**: [English](/en/whitepaper/) | 简体中文
