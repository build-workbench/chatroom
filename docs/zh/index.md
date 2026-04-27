---
layout: home
hero:
  name: ChatRoom 文档
  text: 一个能跑起来、也能读懂的实时全栈项目
  tagline: 用一个紧凑的代码库学习认证、WebSocket、持久化、监控，以及 OpenSpec 驱动的协作流程。
  actions:
    - theme: brand
      text: 快速开始
      link: /zh/getting-started
    - theme: alt
      text: 架构文档
      link: /zh/architecture
    - theme: alt
      text: GitHub
      link: https://github.com/LessUp/chatroom

features:
  - title: 端到端真实链路
    details: 不是孤立知识点，而是把认证、房间、消息、WebSocket 和存储放进同一个可运行项目里理解。
  - title: 仓库边界清晰
    details: README、文档站、OpenSpec 和版本历史各司其职，读者不会在重复内容里迷路。
  - title: 适合教学与自学
    details: 足够小，便于完整阅读；又足够完整，能覆盖交付、监控和规范化协作。
---

## 建议从这里开始

- [快速开始](/zh/getting-started)
- [学习路径](/zh/learning-path)
- [架构文档](/zh/architecture)
- [API 文档](/zh/api)
- [监控指南](/zh/monitoring/README)
- [常见问题](/zh/faq)

## 你可以重点看什么

- JWT 登录与刷新令牌流程
- 房间级 WebSocket 消息广播
- 基于 PostgreSQL + GORM 的持久化设计
- React + TypeScript 聊天客户端的组织方式
- Prometheus 指标与健康检查
- OpenSpec 如何落到日常仓库协作里

## 想看规范定义？

- 规范主目录：[openspec/specs](https://github.com/LessUp/chatroom/tree/master/openspec/specs)
- 活跃变更：[openspec/changes](https://github.com/LessUp/chatroom/tree/master/openspec/changes)
- 仓库工作流：[AGENTS.md](https://github.com/LessUp/chatroom/blob/master/AGENTS.md)
