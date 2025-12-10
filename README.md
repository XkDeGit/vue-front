# Sunny Subscriptions (Vue 3)

Vue 3 + Vite + TypeScript 的订阅管理前端，支持 JWT 登录、模块化 API、双语（en/zh）和淡黄色卡通主题。适配 Windows/macOS/Linux 开发环境。

## 快速开始
- 安装依赖：`npm install`
- 开发调试：`npm run dev`（默认端口由 Vite 分配）
- 生产构建：`npm run build`，本地预览：`npm run preview`
- 代码检查：`npm run lint && npm run type-check`
- 单元测试：`npm run test:unit`

## 环境变量
- `.env.development` / `.env.production` 控制 `VITE_API_BASE_URL`、`VITE_APP_TITLE`
- 私有密钥/差异配置放 `.env.local`（不会入库）

## 技术栈
- Vite + Vue 3 + TypeScript
- 路由：vue-router（登录守卫，未登录跳 `/login`）
- 状态：Pinia；请求：axios + JWT 刷新；数据缓存：TanStack Query
- UI：Element Plus + 自动按需引入；表单：vee-validate + zod；i18n：vue-i18n（en/zh）
- 测试/规范：Vitest + @vue/test-utils，ESLint（TS/Vue flat 配置）+ Prettier，Husky + lint-staged

## 代码与目录
- 入口：`src/main.ts`；根组件：`src/App.vue`
- 路由：`src/router/`；状态：`src/stores/`
- 视图：`src/views/`；组件：`src/components/`
- API：`src/api/` 按模块拆分（auth/plans/customers），统一 axios 实例与拦截器
- 语言包：`src/locales/en|zh/*.json`
- 主题：`src/styles/theme.css`

## 鉴权与拦截
- 登录页：`/login`，成功后跳转 `redirect` 或首页
- token 保存在 `sessionStorage`；请求头自动附带 `Authorization: Bearer <token>`
- 响应拦截器：401 尝试刷新（有 refreshToken 时），失败或 401/403 时清理会话并跳回登录

## 提交与分支
- 提交前建议运行 `npm run lint && npm run test:unit`
- 默认分支 `master`；保持小粒度 commit，使用 Conventional Commits（如 `feat:`, `fix:`）
