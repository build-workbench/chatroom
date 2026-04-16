# ChatRoom 项目规范

本目录包含项目的设计规范、需求文档和任务跟踪。

---

## 目录结构

```
.kiro/
└── specs/
    └── open-source-excellence/    # 开源标准规范
        ├── README.md              # 规范索引（本文件）
        ├── requirements.md        # 需求文档
        ├── design.md              # 设计文档
        └── tasks.md               # 任务清单
```

---

## 规范模块

### [Open Source Excellence](./open-source-excellence/)

将 ChatRoom 从教学 Demo 提升为符合开源社区标准的优秀项目。

**核心领域**：

| 领域 | 状态 | 文档 |
|------|------|------|
| 开源标准文件 | ✅ 完成 | [requirements.md#requirement-1](./open-source-excellence/requirements.md) |
| 项目文档 | ✅ 完成 | [requirements.md#requirement-2](./open-source-excellence/requirements.md) |
| 代码质量 | ✅ 完成 | [requirements.md#requirement-3](./open-source-excellence/requirements.md) |
| 测试覆盖 | ✅ 完成 | [requirements.md#requirement-4](./open-source-excellence/requirements.md) |
| CI/CD | ✅ 完成 | [requirements.md#requirement-5](./open-source-excellence/requirements.md) |
| 容器化部署 | ✅ 完成 | [requirements.md#requirement-6](./open-source-excellence/requirements.md) |
| 版本管理 | ✅ 完成 | [requirements.md#requirement-7](./open-source-excellence/requirements.md) |
| 前端工程化 | ✅ 完成 | [requirements.md#requirement-8](./open-source-excellence/requirements.md) |
| 安全实践 | ✅ 完成 | [requirements.md#requirement-9](./open-source-excellence/requirements.md) |
| 可观测性 | ✅ 完成 | [requirements.md#requirement-10](./open-source-excellence/requirements.md) |

---

## 文档说明

### requirements.md

定义项目改进的需求，包含：

- 用户故事（User Story）
- 验收标准（Acceptance Criteria）
- 术语表（Glossary）

### design.md

描述技术设计方案，包含：

- 架构设计
- 组件接口
- 数据模型
- 正确性属性（Correctness Properties）
- 测试策略

### tasks.md

跟踪具体实施任务，包含：

- 任务清单
- 依赖关系
- 完成状态

---

## 与其他文档的关系

| 文档位置 | 用途 |
|----------|------|
| `CLAUDE.md` | Claude Code 助手指南（开发约定） |
| `docs/` | VitePress 文档站（用户文档） |
| `.kiro/specs/` | 项目规范（设计/需求/任务） |
| `changelog/` | 细粒度变更记录 |

---

## 使用指南

### 添加新规范

1. 在 `.kiro/specs/` 下创建新目录
2. 添加 `requirements.md`、`design.md`、`tasks.md`
3. 更新本文件的目录索引

### 更新规范

- 需求变更：更新 `requirements.md`
- 设计调整：更新 `design.md`
- 任务进度：更新 `tasks.md`

### 验证规范完成度

```bash
# 检查所有需求是否有对应实现
grep -r "THE.*SHALL" .kiro/specs/*/requirements.md

# 检查任务完成状态
grep -r "\- \[x\]" .kiro/specs/*/tasks.md
```
