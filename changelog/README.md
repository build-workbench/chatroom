# Changelog Index

本目录包含项目的细粒度变更记录。主 [CHANGELOG.md](../CHANGELOG.md) 提供版本摘要，这里提供每次重构的详细说明。

---

## 2026 年

### Q1 2026

| 日期 | 文件 | 主题 |
|------|------|------|
| 2026-03-22 | [readme-docs-workflow-alignment.md](2026-03-22_readme-docs-workflow-alignment.md) | README、文档与工作流对齐 |
| 2026-03-13 | [release_readiness_hardening.md](2026-03-13_release_readiness_hardening.md) | 发布就绪收口与安全加固 |
| 2026-03-10 | [pages-optimization.md](2026-03-10_pages-optimization.md) | GitHub Pages 优化 |
| 2026-03-10 | [workflow-deep-standardization.md](2026-03-10_workflow-deep-standardization.md) | 工作流深度标准化 |
| 2026-03-08 | [comprehensive_refactor.md](2026-03-08_comprehensive_refactor.md) | 全面代码重构与优化 |
| 2026-03-06 | [teaching_release_alignment.md](2026-03-06_teaching_release_alignment.md) | 教学发布对齐 |
| 2026-02-13 | [optimization_round2.md](2026-02-13_optimization_round2.md) | 第二轮优化 |
| 2026-02-13 | [code_optimization.md](2026-02-13_code_optimization.md) | 代码优化 |

### 2025 年

### Q4 2025

| 日期 | 文件 | 主题 |
|------|------|------|
| 2025-12-15 | [react_migration.md](2025-12-15_react_migration.md) | React 迁移 |
| 2025-11-25 | [modern_im_upgrade.md](2025-11-25_modern_im_upgrade.md) | 现代化 IM 升级 |
| 2025-11-23 | [frontend_refactor.md](2025-11-23_frontend_refactor.md) | 前端重构与优化 |

---

## 变更分类

### 按类型

**架构重构**
- 2025-11-23: 前端模块化重构
- 2025-12-15: React 迁移
- 2026-03-08: 后端分层重构

**安全加固**
- 2026-03-13: CORS 严格校验、WebSocket origin 验证

**性能优化**
- 2026-02-13: 代码优化
- 2026-03-08: WebSocket 常量提取、连接池优化

**工程化**
- 2026-03-06: CI/CD 配置
- 2026-03-10: 工作流标准化
- 2026-03-22: 文档与 README 对齐

**功能新增**
- 2025-11-25: IM 功能升级
- 2026-03-08: 日志级别配置、健康检查

---

## 贡献指南

添加新的变更记录时：

1. 文件命名：`YYYY-MM-DD_short_description.md`
2. 使用中文编写
3. 包含以下部分：
   - **日期**
   - **变更概述**
   - **详细修改**（按模块分类）
   - **影响范围**
   - **测试验证**

示例：

```markdown
# YYYY-MM-DD 变更简述

## 日期
YYYY-MM-DD

## 变更概述
一句话描述本次变更的目标。

## 详细修改

### 后端
- `internal/xxx`: 具体修改说明

### 前端
- `frontend/src/xxx`: 具体修改说明

## 影响范围
- 影响的功能或模块

## 测试验证
- 验证步骤和结果
```
