# 文档入口与工作流对齐收口

日期：2026-03-22

## 本次调整

### README 体系重构

- 重写 `README.md`，将其收敛为稳定的英文入口页，突出项目定位、运行模式、最小启动方式与文档入口。
- 重构 `README.zh-CN.md`，明确项目教学定位、运行模式矩阵、核心能力、最小验证清单与延伸阅读。
- 统一强调后端优先托管 `frontend/dist`，找不到时回退到 `web/`。

### 配置说明纠偏

- 修正根 README、中文 README、`docs/getting-started.md` 与 `.env.example` 中对 `.env` 的误导性表述。
- 明确当前服务读取的是进程环境变量，`go run ./cmd/server` 不会自动加载 `.env` 文件。
- 在中文 README 与快速开始文档中补充 `ALLOWED_ORIGINS` 的用途、书写规则与生产环境注意事项。

### 文档站与分支事实对齐

- 更新 `docs/FAQ.md`，将 GitHub Pages 说明从未来时改为当前事实描述。
- 更新 `docs/.vitepress/config.mts`，把文档编辑链接从 `main` 改为 `master`，并补充站点 canonical / Open Graph / Twitter 元信息。
- 调整 `.github/workflows/pages.yml`，让文档站构建监听当前默认分支 `master`，并纳入 `README.zh-CN.md` 变更触发。
- 调整 `.github/workflows/ci.yml` 与 `.github/workflows/security.yml`，把分支配置与 `refs/heads/master` 判断对齐到当前仓库默认分支。

## 目的

这次收口的目标不是单纯把 README 写长，而是让仓库入口文档、教学文档站、配置模板与工作流说明统一到同一套代码事实之上，减少后续继续漂移的风险。

## 受影响文件

- `README.md`
- `README.zh-CN.md`
- `.env.example`
- `docs/getting-started.md`
- `docs/FAQ.md`
- `docs/.vitepress/config.mts`
- `CONTRIBUTING.md`
- `PROJECT_ROADMAP.md`
- `.github/workflows/pages.yml`
- `.github/workflows/ci.yml`
- `.github/workflows/security.yml`
