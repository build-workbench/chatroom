# 快速开始

这份页面的目标是让你**用最少步骤把项目跑起来**。

---

## 项目定位

ChatRoom 是一个用于个人练手和教学演示的实时聊天室。

它优先保证：

- ✅ 本地可以快速运行
- ✅ 文档和代码行为一致
- ✅ 测试与构建可直接验证
- ✅ 结构清晰，便于讲解

---

## 前置要求

| 工具 | 版本要求 | 用途 |
|------|----------|------|
| Go | 1.24+ | 后端运行 |
| Node.js | 20+ | 前端构建 |
| Docker | 最新 | PostgreSQL 数据库 |

---

## 一键启动

```bash
# 1. 启动数据库
docker compose up -d postgres

# 2. 启动后端（终端 1）
go run ./cmd/server

# 3. 启动前端（终端 2）
npm --prefix frontend ci
npm --prefix frontend run dev
```

### 访问地址

| 服务 | 地址 |
|------|------|
| 前端开发页 | http://localhost:5173 |
| 后端首页 | http://localhost:8080 |
| 健康检查 | http://localhost:8080/health |
| 就绪检查 | http://localhost:8080/ready |
| 版本信息 | http://localhost:8080/version |
| Prometheus 指标 | http://localhost:8080/metrics |

---

## 项目结构

```
chatroom/
├── cmd/server/          # 程序入口
├── internal/            # 后端核心代码
│   ├── auth/            # JWT、密码、Token
│   ├── config/          # 配置管理
│   ├── db/              # 数据库连接
│   ├── server/          # HTTP 路由
│   ├── service/         # 业务逻辑
│   └── ws/              # WebSocket
├── frontend/            # React 前端
├── web/                 # 静态回退 UI
├── docs/                # VitePress 文档站
└── deploy/              # Docker / Kubernetes
```

---

## 前端说明

仓库包含两套前端：

| 目录 | 内容 | 用途 |
|------|------|------|
| `frontend/` | React 应用 | 开发、测试、构建 |
| `web/` | 静态 HTML/JS | 构建产物不存在时的回退 |

后端优先服务 `frontend/dist`；如果不存在，回退到 `web/`。

---

## 配置说明

### 配置来源

**关键点**：后端直接读取**进程环境变量**，不会自动加载 `.env` 文件。

`.env.example` 的作用：
- 配置模板与说明清单
- Docker / Compose / CI 的变量参考

### 主要配置项

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `APP_PORT` | 8080 | HTTP 监听端口 |
| `APP_ENV` | dev | 运行环境 |
| `DATABASE_DSN` | 本地连接串 | 数据库连接 |
| `JWT_SECRET` | dev-secret-change-me | JWT 密钥（生产必须修改） |
| `ALLOWED_ORIGINS` | 空 | CORS 允许的来源 |
| `ACCESS_TOKEN_TTL_MINUTES` | 15 | Access Token 有效期 |
| `REFRESH_TOKEN_TTL_DAYS` | 7 | Refresh Token 有效期 |
| `LOG_LEVEL` | info | 日志级别 |
| `LOG_FORMAT` | console | 日志格式 |

### 生产环境注意

非 `dev` 环境必须：

1. 设置强随机的 `JWT_SECRET`
2. 配置正确的 `ALLOWED_ORIGINS`
3. 确保数据库连接安全

---

## 运行模式

| 模式 | 运行内容 | 访问地址 | 适用场景 |
|------|----------|----------|----------|
| 本地开发 | Go + Vite dev | localhost:5173 | 日常开发 |
| 构建产物 | Go + frontend/dist | localhost:8080 | 接近发布 |
| 静态回退 | Go + web/ | localhost:8080 | 演示场景 |
| Docker Compose | 全栈容器 | localhost:8080 | 快速体验 |

---

## 常用命令

```bash
# Go 测试
go test -race ./...

# 前端测试
npm --prefix frontend run test

# 前端构建
npm --prefix frontend run build

# 代码检查
make lint

# 代码格式化
make fmt

# 完整验证
make all
```

---

## 最小验证

第一次运行，建议至少验证这 5 步：

1. 访问 `/health` 返回 OK
2. 注册一个用户
3. 登录并创建房间
4. 发送一条消息
5. 刷新页面，确认历史消息加载

详细测试步骤见：[手动测试实验](/zh/manual-testing)

---

## 下一步

- [手动测试实验](/zh/manual-testing) — 完整功能验证
- [API 文档](/zh/api) — 接口详情
- [架构文档](/zh/architecture) — 系统结构
- [设计文档](/zh/design) — 设计决策

---

🌐 **Languages**: [English](/en/getting-started) | 简体中文
