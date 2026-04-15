# Security Policy

## 支持的版本

| 版本 | 支持状态 |
| ---- | -------- |
| 0.2.x | ✅ 支持 |
| 0.1.x | ✅ 支持 |
| < 0.1 | ❌ 不支持 |

---

## 报告安全漏洞

我们非常重视安全问题。如果你发现了安全漏洞，请按以下步骤报告：

### 报告流程

1. **不要**在公开的 Issue、PR 或 Discussions 中报告安全漏洞
2. 发送邮件至 **security@example.com**（请替换为实际安全邮箱）
3. 在邮件中包含以下信息：
   - 漏洞的详细描述
   - 复现步骤（如有）
   - 潜在影响评估
   - 可能的修复建议（可选）

### 响应时间

| 阶段 | 时间 |
|------|------|
| 确认收到报告 | 48 小时内 |
| 初步评估 | 7 天内 |
| 发布修复 | 30 天内（视严重程度） |

### 披露政策

我们遵循**负责任的披露**原则：

- 在修复发布前，请勿公开披露漏洞详情
- 我们会在修复发布后致谢报告者（如你愿意）
- 严重漏洞会发布安全公告

---

## 安全最佳实践

### 部署建议

#### JWT 密钥

| 措施 | 说明 |
|------|------|
| 使用强随机密钥 | ≥ 32 字节，高熵值 |
| 定期轮换 | 建议每 90 天更换 |
| 安全存储 | 不要提交到版本控制 |
| 环境隔离 | 开发/测试/生产使用不同密钥 |

**生成密钥示例**：

```bash
# OpenSSL
openssl rand -base64 32

# Go
go run -e 'package main; import ("crypto/rand"; "encoding/base64"; "fmt"); func main() { b := make([]byte, 32); rand.Read(b); fmt.Println(base64.StdEncoding.EncodeToString(b)) }'
```

#### 数据库安全

| 措施 | 说明 |
|------|------|
| 强密码 | 使用复杂密码 |
| 网络隔离 | 限制数据库网络访问 |
| 定期备份 | 配置自动备份策略 |
| 最小权限 | 应用使用最小必要权限 |

#### HTTPS

| 措施 | 说明 |
|------|------|
| 启用 TLS | 生产环境必须 |
| 有效证书 | 使用受信任 CA 签发的证书 |
| HSTS | 启用 HTTP Strict Transport Security |
| 重定向 | 强制 HTTP → HTTPS |

#### 环境变量

| 措施 | 说明 |
|------|------|
| 敏感配置 | 通过环境变量传递 |
| 禁止提交 | `.env` 文件加入 `.gitignore` |
| 密钥管理 | 使用密钥管理服务（如 AWS Secrets Manager） |

---

## 已实现的安全措施

### 认证与授权

| 措施 | 实现 |
|------|------|
| 密码存储 | bcrypt 哈希，cost=10 |
| JWT 密钥校验 | 非 dev 环境强制检查 |
| Token 有效期 | Access Token 15 分钟，Refresh Token 7 天 |
| Token Rotation | 每次刷新换新 Token 对 |
| WebSocket Ticket | 一次性票据，防重放 |

### 网络安全

| 措施 | 实现 |
|------|------|
| CORS | 严格 origin 白名单校验 |
| 速率限制 | IP + 路径维度，令牌桶算法 |
| 输入验证 | 所有请求参数校验 |

### 数据验证

| 措施 | 实现 |
|------|------|
| 用户名 | 2-64 字符，唯一性约束 |
| 密码 | 4-128 字符 |
| 房间名 | 最大 128 字符 |
| 消息内容 | 最大 2000 字符 |
| WebSocket 消息 | 最大 1 MB |

### 前端安全

| 措施 | 说明 |
|------|------|
| XSS 防护 | React 默认转义，避免 `dangerouslySetInnerHTML` |
| 敏感信息 | 密码不记录日志 |
| Token 存储 | localStorage（教学简化） |

::: warning 生产建议
生产环境建议使用 **httpOnly cookie** 存储 Token，避免 XSS 窃取风险。
:::

---

## 安全配置清单

### 生产环境必查项

```bash
# 1. JWT 密钥
JWT_SECRET=<strong-random-secret>  # 必须！

# 2. 运行环境
APP_ENV=production

# 3. 数据库
DATABASE_DSN=<secure-connection-string>

# 4. CORS
ALLOWED_ORIGINS=https://your-domain.com

# 5. HTTPS（通过反向代理）
# Nginx / Caddy / ALB 配置 TLS
```

### 推荐的安全配置

```env
# 环境
APP_ENV=production

# JWT
JWT_SECRET=<32+ 字节随机字符串>
ACCESS_TOKEN_TTL_MINUTES=15
REFRESH_TOKEN_TTL_DAYS=7

# 数据库（使用 SSL）
DATABASE_DSN=host=db.example.com user=app password=<strong> dbname=chatroom sslmode=require

# CORS
ALLOWED_ORIGINS=https://chat.example.com,https://app.example.com

# 日志
LOG_LEVEL=warn
LOG_FORMAT=json
```

---

## 已知安全考虑

### WebSocket 认证

| 环境 | 认证方式 |
|------|----------|
| 开发环境 | 支持 URL 参数传 Token（方便调试） |
| 生产环境 | 仅使用 WebSocket Ticket |

### 会话管理

- Refresh Token 存储于数据库，支持撤销
- WebSocket Ticket 一次性消费，60 秒有效
- 会话超时自动清理

### 速率限制

| 维度 | 限制 |
|------|------|
| 限制范围 | IP + 路径 |
| 速率 | 20 请求/秒 |
| 突发 | 40 请求 |

---

## 安全更新渠道

安全更新通过以下渠道发布：

- [GitHub Releases](../../releases)
- [CHANGELOG.md](CHANGELOG.md)
- 安全公告（严重漏洞）

**建议订阅 Release 通知**，以及时获取安全更新。

---

## 致谢

感谢所有负责任披露安全问题的研究者！
