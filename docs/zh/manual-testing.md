# 手动测试实验

这份页面把核心功能整理成实验清单，适合课堂演示或个人验证。

## 实验目标

完成后，你将验证：

- ✅ 服务启动正常
- ✅ 用户注册与登录正常
- ✅ 房间创建与切换正常
- ✅ WebSocket 实时通信正常
- ✅ 在线人数、输入状态正常
- ✅ 历史消息加载正常
- ✅ Token 自动刷新正常
- ✅ 静态回退界面正常

---

## 准备工作

### 启动服务

```bash
# 1. 启动数据库
docker compose up -d postgres

# 2. 启动后端
go run ./cmd/server

# 3. 启动前端（另一终端）
npm --prefix frontend run dev
```

### 访问地址

| 服务 | 地址 |
|------|------|
| 前端开发服务器 | http://localhost:5173 |
| 后端首页 | http://localhost:8080 |
| 健康检查 | http://localhost:8080/health |
| 就绪检查 | http://localhost:8080/ready |
| 版本信息 | http://localhost:8080/version |

---

## 实验 1：验证服务启动

### 操作

```bash
# 存活检查
curl http://localhost:8080/health

# 就绪检查
curl http://localhost:8080/ready

# 版本信息
curl http://localhost:8080/version
```

### 预期结果

- `/health` 返回 `{"status": "ok", ...}`
- `/ready` 返回 `{"status": "ready", "checks": {"database": "healthy"}}`
- `/version` 返回版本信息 JSON

### 验证要点

- 服务监听正确端口
- 数据库连接正常
- 版本信息正确显示

---

## 实验 2：用户注册与登录

### 操作

1. 打开 http://localhost:5173
2. 点击"注册"标签
3. 输入用户名（如 `alice`）和密码（如 `testpass`）
4. 点击"注册"按钮
5. 注册成功后，使用相同账号密码登录

### 预期结果

- 注册成功，显示提示信息
- 登录成功，进入聊天主界面
- 左侧显示房间列表区域
- 顶部显示当前用户名

### 验证要点

- 用户名唯一性校验（注册重复用户名应失败）
- 密码长度校验（4-128 字符）
- 登录成功后 Token 正确存储

### 进阶：命令行验证

```bash
# 注册
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}'

# 登录
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}'
```

---

## 实验 3：创建房间

### 操作

1. 登录后，在左侧边栏找到"创建房间"
2. 输入房间名（如 `general`）
3. 点击"创建"按钮

### 预期结果

- 房间创建成功，显示提示信息
- 自动进入新创建的房间
- 房间列表中出现新房间
- 显示房间名和在线人数

### 验证要点

- 房间名唯一性校验
- 创建者自动进入房间
- 在线人数正确（初始为 1）

---

## 实验 4：双窗口实时通信

### 操作

1. 保持当前浏览器窗口（用户 A）
2. 打开新的无痕/隐私窗口
3. 注册并登录第二个用户（如 `bob`）
4. 进入同一个房间
5. 两个窗口分别发送消息

### 预期结果

- 两个窗口都能实时看到对方的消息
- 能看到对方的加入/离开提示
- 在线人数随用户进出变化

### 验证要点

- WebSocket 连接正常
- 消息实时广播
- join/leave 事件正确触发
- 在线人数统计准确

### 消息内容示例

```
用户 A: 你好，这是第一条消息
用户 B: 收到！这是回复
用户 A: 实时通信测试成功 ✓
```

---

## 实验 5：输入状态

### 操作

1. 两个用户处于同一房间
2. 用户 A 在输入框中开始输入（但不发送）
3. 观察用户 B 的界面

### 预期结果

- 用户 B 看到"xxx 正在输入..."提示
- 用户 A 停止输入 3 秒后，提示消失

### 验证要点

- typing 事件正确触发
- 不显示自己的输入状态
- 输入状态超时自动清除

---

## 实验 6：历史消息加载

### 操作

1. 在房间中发送多条消息（如 10 条以上）
2. 刷新页面
3. 重新登录并进入房间

### 预期结果

- 历史消息正确加载并显示
- 消息顺序正确（按时间升序）
- 消息发送者和内容正确

### 验证要点

- 消息持久化正常
- 分页加载正常
- 用户名正确关联

### 进阶：加载更多

如果消息超过 50 条：

1. 滚动到消息列表顶部
2. 应触发"加载更多"
3. 更早的消息被加载

---

## 实验 7：Token 刷新

### 操作

1. 登录后，等待 15 分钟（Access Token 默认过期）
2. 或者在浏览器开发者工具中修改存储的 `chat_access` 为无效值
3. 尝试创建新房间或发送消息

### 预期结果

- 前端自动使用 Refresh Token 刷新
- 用户无感知，操作正常完成
- localStorage 中 Token 更新

### 验证要点

- 401 响应触发自动刷新
- 刷新成功后重试原请求
- 新 Token 对正确存储

### 快速验证（开发者工具）

```javascript
// 在浏览器控制台执行
localStorage.setItem('chat_access', 'invalid_token')
// 然后尝试创建房间，观察是否自动刷新
```

---

## 实验 8：连接断开与重连

### 操作

1. 登录并进入房间
2. 停止后端服务（Ctrl+C）
3. 观察前端界面变化
4. 重启后端服务
5. 观察前端是否自动重连

### 预期结果

- 断开时显示"已断开"或"重连中"状态
- 重启后自动重连
- 重连成功后正常收发消息

### 验证要点

- WebSocket 断开检测
- 指数退避重连策略
- 重连后状态恢复

### 重连策略

```
重连次数  延迟时间
   1       1.0s
   2       1.5s
   3       2.25s
   4       3.375s
   ...     ...
  10       ~15s（最大）
```

---

## 实验 9：静态回退界面

### 操作

1. 停止前端开发服务器
2. 确保没有 `frontend/dist` 目录
3. 只启动后端：`go run ./cmd/server`
4. 访问 http://localhost:8080

### 预期结果

- 页面正常显示（使用 `web/` 目录的静态文件）
- 功能与 React 前端基本一致
- 可以注册、登录、发送消息

### 验证要点

- 静态文件回退机制正常
- `web/` 目录作为备用 UI

---

## 实验 10：速率限制

### 操作

```bash
# 快速发送多个请求
for i in {1..50}; do
  curl -s http://localhost:8080/api/v1/rooms \
    -H "Authorization: Bearer <your_token>" &
done
```

### 预期结果

- 部分请求返回 `429 Too Many Requests`
- 响应体包含 `{"error": "too many requests"}`

### 验证要点

- 速率限制生效
- 限制维度为 IP + 路径
- 正常请求不受影响

---

## 实验 11：健康检查与监控

### 操作

```bash
# Prometheus 指标
curl http://localhost:8080/metrics | grep chat

# 查看具体指标
curl http://localhost:8080/metrics | grep chat_ws_connections
curl http://localhost:8080/metrics | grep http_requests_total
```

### 预期结果

- 返回 Prometheus 格式的指标数据
- `chat_ws_connections` 显示当前连接数
- `http_requests_total` 显示请求计数

---

## 测试清单

完成以下清单，确认核心功能正常：

| 序号 | 测试项 | 通过 |
|------|--------|------|
| 1 | 服务启动与健康检查 | ☐ |
| 2 | 用户注册 | ☐ |
| 3 | 用户登录 | ☐ |
| 4 | 创建房间 | ☐ |
| 5 | 进入房间 | ☐ |
| 6 | 发送消息 | ☐ |
| 7 | 接收消息（实时） | ☐ |
| 8 | 在线人数显示 | ☐ |
| 9 | 输入状态提示 | ☐ |
| 10 | 历史消息加载 | ☐ |
| 11 | Token 自动刷新 | ☐ |
| 12 | 断线重连 | ☐ |
| 13 | 静态回退界面 | ☐ |

---

## 课后阅读

- [API 文档](/zh/api) — 接口详情
- [架构文档](/zh/architecture) — 系统结构
- [设计文档](/zh/design) — 设计决策

---

🌐 **Languages**: [English](/en/manual-testing) | 简体中文
