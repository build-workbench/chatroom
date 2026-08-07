# Frontend

ChatRoom 项目的 React 前端。

功能包括：

- 登录 / 注册
- 房间列表与创建房间
- 实时消息显示
- 在线人数展示
- 正在输入提示
- 历史消息加载

## 与后端的关系

后端通过 `resolveAppRoot()` 按优先级探测静态文件目录：先找 `frontend/dist`（构建产物），找不到则回退到可选的 `web/` 目录。日常开发只需关心 `frontend/`。

## 常用命令

在仓库根目录执行：

```bash
npm --prefix frontend ci
npm --prefix frontend run dev
npm --prefix frontend run test
npm --prefix frontend run build
```

- `npm --prefix frontend run dev` - 启动 Vite 开发服务器（http://localhost:5173）
- `npm --prefix frontend run test` - 运行前端单元测试
- `npm --prefix frontend run build` - 构建前端静态资源到 `frontend/dist`

## 开发联调

```bash
docker compose up -d postgres
go run ./cmd/server
npm --prefix frontend run dev
```

Vite 已配置 `/api` 和 `/ws` 代理，开发模式可直接调用后端。

## 目录说明

- `src/App.tsx` - 应用主入口与状态编排
- `src/components/` - UI 组件
- `src/screens/` - 页面级视图（如鉴权界面）
- `src/hooks/` - 自定义 Hooks（useAuth / useChat / useChatSocket）
- `src/api.ts` - REST API 封装
- `src/socket.ts` - WebSocket 连接与事件处理
- `src/storage.ts` - 本地存储读写逻辑
