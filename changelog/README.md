# Changelog Index

本目录包含项目的细粒度变更记录。主 [CHANGELOG.md](../CHANGELOG.md) 提供版本摘要，这里提供每次重构的详细说明。

---

## 变更索引

### 2026 年 Q1

| 日期 | 文件 | 主题 | 类型 |
|------|------|------|------|
| 2026-03-22 | [readme-docs-workflow-alignment](2026-03-22_readme-docs-workflow-alignment.md) | README、文档与工作流对齐 | 📝 文档 |
| 2026-03-13 | [release_readiness_hardening](2026-03-13_release_readiness_hardening.md) | 发布就绪收口与安全加固 | 🔒 安全 |
| 2026-03-10 | [pages-optimization](2026-03-10_pages-optimization.md) | GitHub Pages 优化 | 🚀 部署 |
| 2026-03-10 | [workflow-deep-standardization](2026-03-10_workflow-deep-standardization.md) | 工作流深度标准化 | 🔧 CI/CD |
| 2026-03-08 | [comprehensive_refactor](2026-03-08_comprehensive_refactor.md) | 全面代码重构与优化 | ♻️ 重构 |
| 2026-03-06 | [teaching_release_alignment](2026-03-06_teaching_release_alignment.md) | 教学发布对齐 | 📝 文档 |
| 2026-02-13 | [optimization_round2](2026-02-13_optimization_round2.md) | 第二轮优化 | ⚡ 性能 |
| 2026-02-13 | [code_optimization](2026-02-13_code_optimization.md) | 代码优化 | ⚡ 性能 |

### 2025 年 Q4

| 日期 | 文件 | 主题 | 类型 |
|------|------|------|------|
| 2025-12-15 | [react_migration](2025-12-15_react_migration.md) | React 迁移 | ♻️ 重构 |
| 2025-11-25 | [modern_im_upgrade](2025-11-25_modern_im_upgrade.md) | 现代化 IM 升级 | ✨ 功能 |
| 2025-11-23 | [frontend_refactor](2025-11-23_frontend_refactor.md) | 前端重构与优化 | ♻️ 重构 |

---

## 变更类型说明

| 图标 | 类型 | 说明 |
|------|------|------|
| ✨ | 功能 | 新功能添加 |
| ♻️ | 重构 | 代码重构 |
| 🔒 | 安全 | 安全相关改进 |
| ⚡ | 性能 | 性能优化 |
| 📝 | 文档 | 文档更新 |
| 🔧 | CI/CD | CI/CD 配置更新 |
| 🚀 | 部署 | 部署相关改进 |
| 🐛 | 修复 | Bug 修复 |

---

## 版本里程碑

### v0.2.0 (2026-03-08)

**开源标准与工程化**

- 开源标准文件（LICENSE, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY）
- CI/CD 流水线（GitHub Actions）
- VitePress 文档站
- Docker 多阶段构建
- Kubernetes 部署清单
- 健康检查端点
- 安全加固（CORS, JWT 校验）

**相关变更**：
- 2026-03-06: 教学发布对齐
- 2026-03-08: 全面代码重构
- 2026-03-10: 工作流标准化
- 2026-03-13: 安全加固
- 2026-03-22: 文档对齐

### v0.1.0 (2025-01-08)

**初始版本**

- 用户注册和登录（JWT 认证）
- 聊天房间创建和管理
- WebSocket 实时消息
- PostgreSQL 消息持久化
- React 前端

**相关变更**：
- 2025-11-23: 前端重构
- 2025-11-25: IM 功能升级
- 2025-12-15: React 迁移
- 2026-02-13: 代码优化

---

## 变更分类

### 按模块

| 模块 | 变更数 |
|------|--------|
| 后端 | 6 |
| 前端 | 5 |
| CI/CD | 3 |
| 文档 | 4 |
| 部署 | 2 |

### 按影响范围

| 范围 | 变更数 |
|------|--------|
| 架构重构 | 3 |
| 安全加固 | 2 |
| 性能优化 | 2 |
| 工程化 | 3 |
| 功能新增 | 1 |

---

## 贡献指南

添加新的变更记录时：

### 文件命名

```
YYYY-MM-DD_short_description.md
```

### 内容模板

```markdown
# 变更简述

日期：YYYY-MM-DD

## 变更概述

一句话描述本次变更的目标。

## 详细修改

### 后端
- `internal/xxx`: 具体修改说明

### 前端
- `frontend/src/xxx`: 具体修改说明

### CI/CD
- `.github/workflows/xxx`: 具体修改说明

## 影响范围

- 影响的功能或模块
- 是否需要数据库迁移
- 是否需要配置变更

## 测试验证

- 验证步骤和结果

## 关联 Issue

Refs #123
```

### 注意事项

1. 使用中文编写
2. 日期使用 ISO 格式（YYYY-MM-DD）
3. 简述使用英文 kebab-case
4. 关联相关 Issue 编号
