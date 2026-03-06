---
layout: home
hero:
  name: ChatRoom 教学文档
  text: 从运行项目到理解实时聊天系统
  tagline: 面向个人练手与教学演示的 Go + React + WebSocket 聊天室文档站。
  actions:
    - theme: brand
      text: 开始学习
      link: /getting-started
    - theme: alt
      text: 手动测试实验
      link: /manual-testing
    - theme: alt
      text: 查看 API
      link: /API
features:
  - title: 先跑起来
    details: 用最短路径启动数据库、后端和前端，快速得到一个可用的聊天室演示环境。
  - title: 再看原理
    details: 通过架构文档、设计文档和 API 文档，理解 REST、JWT 和 WebSocket 的协作方式。
  - title: 最后做实验
    details: 按照手动测试实验清单，一步步验证注册、登录、房间、消息、在线人数和输入状态。
---

## 这份文档适合谁

- 想用一个小项目练习 Go 后端开发的人
- 想理解 React 前端如何接入 REST + WebSocket 的人
- 想把这个仓库当成课堂演示或自学教材的人

## 推荐阅读顺序

1. [快速开始](/getting-started)
2. [手动测试实验](/manual-testing)
3. [API 文档](/API)
4. [架构文档](/ARCHITECTURE)
5. [设计文档](/DESIGN)
6. [监控指南](/monitoring/README)
7. [常见问题](/FAQ)

## 你将学到什么

### 后端部分

- Gin 路由与中间件的组织方式
- JWT / Refresh Token 的基本鉴权流程
- GORM 与 PostgreSQL 的配合方式
- WebSocket 房间广播的基本实现

### 前端部分

- React 前端如何组织认证、房间、消息状态
- 本地存储与登录态恢复
- WebSocket 连接状态与事件处理
- `frontend/` 与 `web/` 两套界面的职责差异

### 工程化部分

- 如何运行后端与前端测试
- 如何阅读 Release 与 CI 流程
- 如何把 Markdown 文档演化为在线教学站
