# GitHub Pages 优化 (2026-03-10)

## 变更内容

### pages.yml 工作流优化

1. **sparse-checkout** — 只拉取 `docs/` 和 `.github/`，跳过 frontend/、internal/、server.exe（~40MB）等无关目录
2. **npm ci** — 替换 `npm install`，确保确定性安装
3. **Node.js npm 缓存** — 利用 `actions/setup-node` 的 `cache` 参数加速依赖安装
4. **扩展 paths 触发** — 新增 `CHANGELOG.md`、`SECURITY.md` 变更也触发文档重建

### VitePress 配置修复

5. **移除不存在的 en/ locale** — config.mts 引用了 `en/` 目录下的页面，但这些文件不存在，会导致部署后出现断链。简化为纯中文站点
6. **添加 SEO meta 标签** — theme-color、og:type、og:title、og:description

### README 徽章与引用修复

7. **README.md** — 添加 CI 和 Docs workflow 状态徽章
8. **README.zh-CN.md** — 添加 CI 徽章，Docs 徽章升级为 workflow 状态徽章
9. **README.zh-CN.md** — 修正工作流文件名引用 `docs.yml` → `pages.yml`

### 文档首页增强

10. **index.md** — 为 features 添加 emoji 图标，新增 JWT 鉴权、WebSocket 实时通信、Prometheus 监控三张卡片
11. **index.md** — 新增技术栈总览表
12. **index.md** — 推荐阅读顺序添加简要说明
