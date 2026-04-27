# 开发指南

本文档介绍如何搭建开发环境、运行测试以及参与项目开发。

## 环境要求

| 工具 | 版本 | 用途 |
|------|------|------|
| Go | 1.24+ | 后端开发 |
| Node.js | 20+ | 前端开发、文档构建 |
| Docker | 最新版 | PostgreSQL 数据库 |
| Make | 任意 | 构建命令 |

## 快速开始

### 1. 启动数据库

```bash
# 使用 Docker 启动 PostgreSQL
docker compose up -d postgres

# 或手动启动
docker run -d --name chatroom-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=chatroom \
  -p 5432:5432 \
  postgres:16-alpine
```

### 2. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑配置（开发环境可使用默认值）
# 注意：应用不会自动加载 .env 文件，需要导出到环境变量
export $(cat .env | xargs)
```

### 3. 启动后端

```bash
# 安装依赖并运行
go mod download
go run ./cmd/server

# 或使用 Make
make run
```

### 4. 启动前端

```bash
cd frontend
npm install
npm run dev
```

前端开发服务器会自动代理 `/api` 和 `/ws` 到后端 `localhost:8080`。

## 常用命令

### 后端

```bash
make lint          # 代码检查
make test          # 运行测试
make test-coverage # 测试覆盖率报告
make build         # 构建二进制文件
```

### 前端

```bash
cd frontend
npm run lint       # 代码检查
npm run test       # 运行测试
npm run build      # 生产构建
```

### 文档

```bash
cd docs
npm install
npm run docs:dev   # 本地预览
npm run docs:build # 构建文档站点
```

## 项目结构

```
chatroom/
├── cmd/server/        # 应用入口
├── internal/          # 私有应用代码
│   ├── auth/          # JWT 认证逻辑
│   ├── config/        # 配置管理
│   ├── db/            # 数据库连接
│   ├── models/        # 数据模型
│   ├── mw/            # HTTP 中间件
│   ├── sanitize/      # 输入清理
│   ├── server/        # HTTP 处理器
│   ├── service/       # 业务逻辑
│   └── ws/            # WebSocket 实现
├── frontend/          # React 前端
│   └── src/
│       ├── components/  # UI 组件
│       ├── hooks/       # 自定义 Hooks
│       ├── screens/     # 页面组件
│       └── test/        # 测试工具
├── docs/              # VitePress 文档
├── openspec/          # OpenSpec 规范
└── deploy/            # 部署配置
```

## OpenSpec 工作流

项目使用 OpenSpec 驱动开发，主要流程：

1. **探索**: `/opsx:explore` - 深入理解需求
2. **提案**: `/opsx:propose <name>` - 创建变更提案
3. **实现**: `/opsx:apply <name>` - 按任务实施
4. **归档**: `/opsx:archive <name>` - 完成归档

详细规范参见 `openspec/specs/` 目录。

## 代码规范

### Go

- 使用 `golangci-lint` 进行代码检查
- 遵循 Go 官方代码风格
- 测试覆盖关键业务逻辑

### TypeScript

- 使用 ESLint + Prettier
- 严格模式 TypeScript
- 组件使用函数式组件 + Hooks

### 提交规范

使用 Conventional Commits：

```
feat: 添加新功能
fix: 修复 bug
docs: 文档更新
refactor: 代码重构
test: 测试相关
chore: 构建/工具变更
```

## 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `APP_PORT` | 8080 | HTTP 端口 |
| `APP_ENV` | dev | 运行环境 |
| `DATABASE_DSN` | - | PostgreSQL 连接串 |
| `JWT_SECRET` | dev-secret-change-me | JWT 密钥（生产必须修改） |
| `ALLOWED_ORIGINS` | - | CORS 白名单 |
| `WS_MAX_MESSAGE_SIZE` | 1048576 | WebSocket 消息最大字节数 |
| `WS_MAX_CONTENT_SIZE` | 2000 | 聊天消息最大字符数 |
| `DB_MAX_IDLE_CONNS` | 5 | 数据库连接池空闲连接数 |
| `DB_MAX_OPEN_CONNS` | 20 | 数据库连接池最大连接数 |

## 常见问题

### 数据库连接失败

确保 PostgreSQL 正在运行，且连接串正确：

```bash
docker compose up -d postgres
docker compose ps
```

### 前端无法连接后端

检查后端是否在 8080 端口运行，Vite 开发服务器会自动代理请求。

### 测试失败

测试需要 PostgreSQL 运行：

```bash
docker compose up -d postgres
make test
```

## 更多资源

- [API 文档](./api.md)
- [架构文档](./architecture.md)
- [监控指南](./monitoring/README.md)
