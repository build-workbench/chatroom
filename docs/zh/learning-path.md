# 学习路径

ChatRoom 是一个教学导向的项目，我们为不同类型的学习者设计了不同的学习路径。选择最适合你的路径，开始你的全栈开发之旅。

---

## 👨‍💻 后端开发者路径 {#backend}

**预计时间**: 2-3 小时  
**目标**: 深入理解 Go 后端开发，掌握 JWT、WebSocket、数据库等核心技能

### 步骤概览

| 步骤 | 主题 | 时间 | 目标 |
|-----|------|------|------|
| 1 | 项目结构与依赖 | 20 分钟 | 理解 Clean Architecture 组织方式 |
| 2 | 数据库设计 | 30 分钟 | 掌握 GORM 建模与迁移 |
| 3 | JWT 双 Token 实现 | 40 分钟 | 理解认证流程与安全设计 |
| 4 | WebSocket Hub | 45 分钟 | 掌握广播机制与会话管理 |
| 5 | 部署与运维 | 30 分钟 | Docker & K8s 实践 |

### 详细步骤

#### 步骤 1: 项目结构与依赖设计

**阅读材料**:
- [架构文档](./architecture) - 整体架构概览
- [设计文档](./design) - 设计决策与思考

**关键学习目标**:
- 理解 `internal/` 目录的组织方式
- 掌握接口驱动设计（Interface-Driven Design）
- 了解依赖注入的简单实现

**实践任务**:
```bash
# 分析项目结构
tree internal/ -L 2

# 理解依赖关系
cat internal/server/server.go | head -50
```

---

#### 步骤 2: 数据库设计与 GORM

**阅读材料**:
- `internal/models/` 目录下的模型定义
- [API 文档](./api) - 数据模型相关

**关键学习目标**:
- GORM 模型定义与关联
- 数据库迁移管理
- PostgreSQL 特性使用（JSON 字段、索引等）

**实践任务**:
```go
// 尝试添加一个新的字段到 User 模型
// 在 internal/models/user.go 中添加 Avatar 字段

// 然后运行迁移验证
docker compose up -d postgres
go run ./cmd/server
```

---

#### 步骤 3: JWT 双 Token 认证

**阅读材料**:
- `internal/auth/` 目录
- [API 文档 - 认证部分](./api#认证)

**关键学习目标**:
- Access Token vs Refresh Token 的区别
- Token 轮换（Rotation）机制
- 安全存储与传输

**实践任务**:
```bash
# 使用 curl 测试认证流程

# 1. 注册用户
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","username":"testuser"}'

# 2. 登录获取 Token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

#### 步骤 4: WebSocket Hub 广播机制

**阅读材料**:
- `internal/ws/` 目录
- [架构文档 - WebSocket 层](./architecture#websocket-层)

**关键学习目标**:
- Hub 模式设计原理
- 房间（Room）管理与广播
- 心跳检测与重连
- 分布式部署时的消息同步

**实践任务**:
```bash
# 使用 wscat 测试 WebSocket
npm install -g wscat

# 连接 WebSocket（需要先获取 token）
wscat -c "ws://localhost:8080/ws?token=YOUR_TOKEN"

# 尝试发送消息
{"type":"message","content":"Hello","room_id":1}
```

---

#### 步骤 5: Docker 与 Kubernetes 部署

**阅读材料**:
- `deploy/` 目录
- [设计文档 - 部署部分](./design#部署考量)

**关键学习目标**:
- 多阶段 Docker 构建优化
- Kubernetes 资源清单编写
- 配置管理与 Secret 处理

**实践任务**:
```bash
# 构建 Docker 镜像
docker build -t chatroom:latest -f deploy/docker/Dockerfile .

# 本地测试运行
docker run -p 8080:8080 -e DATABASE_DSN=... chatroom:latest
```

---

## 👩‍💻 前端开发者路径 {#frontend}

**预计时间**: 1-2 小时  
**目标**: 掌握 React + TypeScript，实现实时交互界面

### 步骤概览

| 步骤 | 主题 | 时间 | 目标 |
|-----|------|------|------|
| 1 | API 接口概览 | 15 分钟 | 理解 REST + WebSocket 接口 |
| 2 | WebSocket 客户端 | 30 分钟 | 掌握连接与重连策略 |
| 3 | React Hooks | 25 分钟 | 状态管理与副作用处理 |
| 4 | Token 刷新机制 | 20 分钟 | 自动刷新与错误处理 |
| 5 | UI 实现 | 30 分钟 | 组件设计与实时更新 |

### 详细步骤

#### 步骤 1: API 接口概览

**阅读材料**:
- [API 文档](./api)
- `frontend/src/services/api.ts`

**关键学习目标**:
- REST API 调用规范
- WebSocket 消息协议
- TypeScript 类型定义

---

#### 步骤 2: WebSocket 客户端封装

**阅读材料**:
- `frontend/src/services/websocket.ts`

**关键学习目标**:
- WebSocket 连接生命周期
- 断线重连策略
- 消息收发与回调

**代码重点**:
```typescript
// 理解 reconnect 逻辑
// 观察 heartbeat 实现
// 学习 room subscription 管理
```

---

#### 步骤 3: React Hooks 状态管理

**阅读材料**:
- `frontend/src/hooks/` 目录
- React hooks 最佳实践

**关键学习目标**:
- `useState` 与状态提升
- `useEffect` 清理副作用
- 自定义 Hook 封装

**实践任务**:
```typescript
// 尝试创建一个新的 Hook
// useMessages.ts - 消息列表管理

export function useMessages(roomId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  // ...
  return { messages, sendMessage };
}
```

---

#### 步骤 4: Token 自动刷新

**阅读材料**:
- `frontend/src/services/auth.ts`
- `frontend/src/contexts/AuthContext.tsx`

**关键学习目标**:
- Axios 拦截器使用
- 401 错误处理
- Token 刷新队列

---

#### 步骤 5: 实时 UI 实现

**阅读材料**:
- `frontend/src/components/chat/` 目录

**关键学习目标**:
- 虚拟列表优化
- 消息时间分组
- 输入状态显示

---

## 🎯 全栈开发者路径 {#fullstack}

**预计时间**: 4-5 小时  
**目标**: 完整掌握前后端，独立开发部署全栈应用

### 步骤概览

| 步骤 | 主题 | 时间 | 目标 |
|-----|------|------|------|
| 1 | 快速启动与环境 | 20 分钟 | 搭建开发环境 |
| 2 | 代码走读 | 60 分钟 | 全链路理解 |
| 3 | 功能扩展实战 | 90 分钟 | 添加新功能 |
| 4 | 测试编写 | 45 分钟 | 单元与集成测试 |
| 5 | 生产部署 | 30 分钟 | 完整上线流程 |

### 详细步骤

#### 步骤 1: 快速启动

参照 [快速开始](./getting-started) 完成环境搭建。

---

#### 步骤 2: 代码走读

**路线**: 从用户操作到数据存储的完整链路

```
用户注册
  ↓
前端表单 → API 调用
  ↓
后端路由 → 处理器 → 服务层
  ↓
数据库操作
  ↓
返回响应 → 前端更新
```

---

#### 步骤 3: 功能扩展实战

**任务**: 添加"用户头像上传"功能

**涉及改动**:
- 后端: 新增 `avatar` 字段，上传接口
- 前端: 头像组件，图片裁剪
- 数据库: 新增字段迁移

---

#### 步骤 4: 测试编写

**学习目标**:
- Go 单元测试（`testing` + testify）
- Go 集成测试（测试数据库）
- React 组件测试（React Testing Library）

**实践**:
```bash
# 后端测试
go test -v ./internal/auth/...

# 前端测试
npm --prefix frontend run test
```

---

#### 步骤 5: 生产部署

**完整流程**:
1. 环境变量配置
2. 数据库创建
3. 构建 Docker 镜像
4. 推送到镜像仓库
5. Kubernetes 部署
6. 配置域名与 SSL

---

## 📚 推荐阅读顺序

如果没有特定目标，按以下顺序阅读：

1. [快速开始](./getting-started) — 5 分钟启动项目
2. [手动测试实验](./manual-testing) — 验证核心功能
3. [API 文档](./api) — 理解接口设计
4. [架构文档](./architecture) — 系统分层与数据流
5. [设计文档](./design) — 设计决策与扩展方向

---

## 💡 学习建议

### 边读边动手

不要只看不练，遇到代码片段就打开项目对照:
```bash
# 保持终端随时可用
code .  # VS Code 打开项目
```

### 记录问题

准备一个笔记文件记录:
- 不理解的代码
- 想优化的设计
- 遇到的错误

### 尝试修改

读完一个模块后，尝试修改一个功能:
- 改变颜色主题
- 添加一个字段
- 修改响应格式

### 参与讨论

遇到问题可以:
- 查看 [FAQ](./faq)
- 提交 GitHub Issue
- 阅读源码注释
