# Repository Guidelines

Vue 3 订阅管理项目的工作约定，保持改动小、可测试、易回滚。

## Tech Stack
- Vite + Vue 3 + TypeScript；Pinia 管状态，vue-router 做守卫和懒加载。
- axios 统一实例（JWT 鉴权/刷新，默认 POST JSON）；必要时加 TanStack Query 做缓存与重试。
- UI：Element Plus（配合 `unplugin-vue-components/auto-import`），表单 vee-validate + zod，图表 echarts；i18n 用 vue-i18n（en/zh）。
- 质量：Vitest + @vue/test-utils；Playwright/Cypress 覆盖关键流；ESLint + Prettier；Husky + lint-staged。

## Theme & i18n
- 配色：淡黄色系 `#fff7e0` 背景，强调 `#ffc94a`，深灰文字 `#1f2937`，柔和圆角，轻渐变；Element Plus 通过主题变量覆盖。
- 文案：`src/locales/en/*.json`、`src/locales/zh/*.json` 分模块存放，键前缀按领域如 `plans.nameLabel`。

## Configuration
- 路径别名：`vite.config.ts` 添加 `@ -> /src`，常用 `@api -> /src/api`、`@components -> /src/components`。
- 环境：`.env` 通用，`.env.development`/`.env.production` 设置 `VITE_API_BASE_URL`、`VITE_APP_TITLE` 等；用 `import.meta.env` 读取。

## Project Structure
- 入口 `src/main.ts`，根组件 `src/App.vue`；路由 `src/router/`；状态 `src/stores/`。
- 视图 `src/views/`，复用组件 `src/components/`；资产 `public/`（原样）与 `src/assets/`（打包）。
- API 模块化：`src/api/plans.ts`、`customers.ts`、`auth.ts` 等封装 axios，`src/api/index.ts` 汇总导出。

## Build & Run
- `npm install` 安装依赖；`npm run dev` 开发；`npm run build` 生产；`npm run preview` 预览。
- `npm run lint` 代码规范；`npm run test:unit`（或 `npm run test`）执行单测。

## Code Style
- TypeScript 开 `strict`、`noImplicitOverride`、`noUnusedLocals/Parameters`、`noUncheckedIndexedAccess`、`exactOptionalPropertyTypes`。
- ESLint flat：`@typescript-eslint`（recommended-type-checked）、`eslint-plugin-vue`（vue3-recommended）、`eslint-plugin-import`、`eslint-plugin-unused-imports`；`eslint-config-prettier` + Prettier 分工格式。
- 命名：组件/文件 PascalCase，composable `useXxx`，工具 camelCase；导入按第三方/别名/相对分组。
- Vue 推荐 `<script setup>` Composition API；样式 scoped，类名可用 BEM；少用 `any`，必要时注释说明。
- 提交前跑 `npm run lint && npm run test:unit`；CI 可加 `tsc --noEmit`。

## Testing
- 单测靠 Vitest + @vue/test-utils，文件 `*.spec.ts` 靠近源文件；必要时 stub HTTP。
- 关键流程（下单、变更套餐、登录）用 Playwright/Cypress，保持快照精简。

## Commit & PR
- 提交信息简洁祈使句，倾向 Conventional Commits（如 `feat:`、`fix:`）。
- PR 需写变更摘要、关联 issue、运行过的命令、UI 改动的截图/GIF；保持单一主题易审阅。

## Security
- 不要提交密钥；本地覆盖放 `.env.local`，同步更新 `.env.example`。
- 用 LTS Node（18+）；升级依赖时跑 `npm audit` 或等价检查。
