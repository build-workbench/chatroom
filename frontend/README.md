# Frontend

这是 ChatRoom 项目的 React 主前端。

它负责提供更完整的聊天界面体验，包括：

- 登录 / 注册
- 房间列表与创建房间
- 实时消息显示
- 在线人数展示
- 正在输入提示
- 历史消息加载

## 与后端、`web/` 的关系

- `frontend/` 是主前端，日常开发以它为主
- `web/` 是静态回退界面
- 当仓库根目录下存在 `frontend/dist` 时，后端会优先服务该构建结果
- 当 `frontend/dist` 不存在时，后端会退回服务 `web/`

因此：

- 想做前端开发时，主要看 `frontend/`
- 想测试后端静态资源回退逻辑时，观察 `web/`

## 常用命令

在仓库根目录执行：

```bash
npm --prefix frontend ci
npm --prefix frontend run dev
npm --prefix frontend run test
npm --prefix frontend run build
```

含义如下：

- `npm --prefix frontend run dev`
  - 启动 Vite 开发服务器，默认访问 `http://localhost:5173`

- `npm --prefix frontend run test`
  - 运行前端单元测试

- `npm --prefix frontend run build`
  - 构建前端静态资源到 `frontend/dist`

## 开发联调

本地联调推荐按以下顺序启动：

```bash
docker compose up -d postgres
go run ./cmd/server
npm --prefix frontend run dev
```

此时：

- 前端开发页：`http://localhost:5173`
- 后端接口：`http://localhost:8080`

Vite 已经配置了 `/api` 和 `/ws` 代理，因此开发模式可以直接调用后端。

## 目录说明

- `src/App.tsx`
  - 应用主入口与状态编排

- `src/components/`
  - 主要 UI 组件

- `src/screens/`
  - 页面级视图，如鉴权界面

- `src/api.ts`
  - REST API 封装

- `src/socket.ts`
  - WebSocket 连接与事件处理

- `src/storage.ts`
  - 本地存储读写逻辑

## 说明

这个前端主要服务于教学与练手目标，因此优先追求：

- 代码路径清晰
- 联调成本低
- 测试能跑通
- 构建结果能被后端直接服务

如果后续要进一步增强体验，可以继续补充：

- 更完整的组件测试
- E2E 测试
- 错误态与空态优化
- UI 截图或交互演示文档
