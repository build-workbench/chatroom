# Contributing to ChatRoom

感谢你对 ChatRoom 项目的关注！我们欢迎各种形式的贡献。

## 行为准则

参与本项目即表示你同意遵守我们的 [行为准则](CODE_OF_CONDUCT.md)。

---

## 如何贡献

### 报告 Bug

1. 在 [Issues](../../issues) 中搜索是否已有相同问题
2. 如果没有，点击 **New Issue** → **Bug Report**
3. 提供以下信息：
   - 复现步骤
   - 期望行为
   - 实际行为
   - 环境信息（Go 版本、Node 版本、操作系统）
   - 相关日志或截图

### 提出新功能

1. 在 [Issues](../../issues) 中搜索是否已有相同建议
2. 如果没有，点击 **New Issue** → **Feature Request**
3. 描述以下内容：
   - 功能描述
   - 使用场景
   - 期望行为

### 提交代码

```bash
# 1. Fork 仓库
# 2. 克隆你的 Fork
git clone https://github.com/<your-username>/chatroom.git
cd chatroom

# 3. 创建功能分支
git checkout -b feature/your-feature-name

# 4. 进行修改并提交
git add .
git commit -m "添加新功能描述"

# 5. 推送到你的 Fork
git push origin feature/your-feature-name

# 6. 创建 Pull Request
```

---

## 开发环境设置

### 前置要求

| 工具 | 版本 | 用途 |
|------|------|------|
| Go | 1.24+ | 后端开发 |
| Node.js | 20+ | 前端开发 |
| Docker | 最新 | PostgreSQL |
| Make | 任意 | 常用命令 |

### 快速开始

```bash
# 克隆仓库
git clone https://github.com/LessUp/chatroom.git
cd chatroom

# 启动数据库
docker compose up -d postgres

# 运行后端
go run ./cmd/server

# 运行前端（另一终端）
npm --prefix frontend ci
npm --prefix frontend run dev
```

### 环境说明

**重要**：后端直接读取进程环境变量，**不会自动加载 `.env` 文件**。

```bash
# 方式 1：直接设置环境变量
export JWT_SECRET=your-secret
go run ./cmd/server

# 方式 2：手动 source
set -a && source .env && set +a
go run ./cmd/server

# 方式 3：Docker Compose
docker compose up -d
```

---

## 常用命令

### 后端

```bash
make build      # 构建项目
make test       # 运行测试
make test-coverage # 测试覆盖率报告
make lint       # 代码检查
make fmt        # 格式化代码
make vet        # go vet 检查
```

### 前端

```bash
npm --prefix frontend run dev      # 开发服务器
npm --prefix frontend run build    # 构建
npm --prefix frontend run test     # 测试
npm --prefix frontend run lint     # 代码检查
```

### 文档

```bash
npm --prefix docs ci               # 安装依赖
npm --prefix docs run docs:dev     # 本地预览
npm --prefix docs run docs:build   # 构建
```

---

## 代码风格

### Go 代码

| 规范 | 说明 |
|------|------|
| 格式化 | `gofmt` |
| 导入排序 | `goimports -w -local chatroom .` |
| 命名 | 导出 `CamelCase`，内部 `camelCase` |
| JSON 标签 | `snake_case` |
| 测试 | 同包 `*_test.go`，表驱动测试 |

### TypeScript/React 代码

| 规范 | 说明 |
|------|------|
| 格式化 | Prettier |
| 缩进 | 2 空格 |
| 组件 | 函数组件 + Hooks |
| 文件名 | `kebab-case` |

### 提交信息

使用中文，祈使句，不超过 50 字符：

```
添加用户认证中间件

- 实现 JWT 验证
- 添加刷新令牌轮换
- 更新 API 文档

Refs #42
```

**提交类型参考**：

- `添加` / `新增`：新功能
- `修复`：Bug 修复
- `优化` / `重构`：代码改进
- `更新`：文档或配置更新
- `删除`：移除代码或文件

---

## 测试指南

### 运行测试

```bash
# 所有 Go 测试（需要 PostgreSQL）
docker compose up -d postgres
go test -race -cover ./...

# 前端测试
npm --prefix frontend run test

# 前端测试（监听模式）
npm --prefix frontend run test:watch
```

### 编写测试

**Go 测试规范**：

```go
func TestFunctionName_Scenario_Expected(t *testing.T) {
    // 使用表驱动测试
    tests := []struct {
        name    string
        input   int
        want    int
        wantErr bool
    }{
        {"positive", 1, 2, false},
        {"negative", -1, 0, true},
    }
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            got, err := Function(tt.input)
            if (err != nil) != tt.wantErr {
                t.Errorf("Function() error = %v, wantErr %v", err, tt.wantErr)
            }
            if got != tt.want {
                t.Errorf("Function() = %v, want %v", got, tt.want)
            }
        })
    }
}
```

**前端测试规范**：

```typescript
describe('功能模块', () => {
  it('应该正确处理场景', () => {
    const result = functionUnderTest(input)
    expect(result).toBe(expectedOutput)
  })
})
```

---

## Pull Request 流程

### 提交前检查

```bash
# 1. 运行测试
make test
npm --prefix frontend run test

# 2. 代码检查
make lint
npm --prefix frontend run lint

# 3. 构建
make build
npm --prefix frontend run build
```

### PR 检查清单

- [ ] 代码遵循项目风格指南
- [ ] 添加了必要的测试
- [ ] 所有测试通过
- [ ] 更新了相关文档
- [ ] 提交信息清晰明了

### Review 流程

1. 提交 PR 后，CI 自动运行测试
2. 至少一位维护者 Review 代码
3. 处理 Review 意见
4. 通过后合并到 `master`

---

## 项目结构

```
chatroom/
├── cmd/server/          # 程序入口
├── internal/            # 后端核心代码
│   ├── auth/            # 认证
│   ├── config/          # 配置
│   ├── db/              # 数据库
│   ├── server/          # HTTP
│   ├── service/         # 业务
│   └── ws/              # WebSocket
├── frontend/            # React 前端
├── web/                 # 静态回退
├── docs/                # VitePress 文档
├── deploy/              # 部署配置
└── .github/workflows/   # CI/CD
```

---

## 版本发布

版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)：

- `MAJOR`：不兼容的 API 变更
- `MINOR`：向后兼容的功能新增
- `PATCH`：向后兼容的问题修复

---

## 获取帮助

- 📖 [文档站](https://lessup.github.io/chatroom/)
- 💬 [Discussions](../../discussions)
- 📝 [FAQ](docs/FAQ.md)

---

再次感谢你的贡献！🎉
