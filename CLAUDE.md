# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此代码仓库中工作时提供指导。

# 仓库开发规范

Vue 3 订阅管理项目的工作约定，保持改动小、可测试、易回滚。

## 项目概览

Vue 3 订阅管理前端项目，具备 JWT 身份验证、双语支持（中英文）、Element Plus UI。基于 Vite + TypeScript 构建。所有控件都要使用latest版本。

## 开发命令

```bash
# 开发相关
npm run dev                  # 启动开发服务器
npm run build               # 生产环境构建
npm run preview             # 预览生产构建

# 代码质量
npm run lint                # 对 .ts, .tsx, .vue 文件运行 ESLint
npm run type-check          # 运行 TypeScript 编译器检查
npm run format              # 用 Prettier 检查格式
npm run format:write        # 用 Prettier 修复格式

# 测试
npm run test                # 以监听模式运行测试
npm run test:unit           # 运行单元测试
vitest path/to/file.spec.ts # 运行指定测试文件
```

## 架构说明

### 应用初始化 (src/main.ts)
插件按以下顺序注册：
1. Pinia（状态管理）
2. Vue Router
3. Element Plus（UI 框架）
4. TanStack Query（配合 QueryClient）
5. vue-i18n

### HTTP 客户端 (src/api/http.ts)
- 集中式 axios 实例，超时时间 15 秒
- 请求拦截器：从 auth store 自动附加 `Authorization: Bearer <token>`
- 响应拦截器：处理 401 并自动刷新 token（通过 `_retry` 标记每个请求只刷新一次），在 401/403 时清除会话并重定向

### 身份验证流程
- **Store**：`src/stores/auth.ts` 在 sessionStorage 中管理 token（accessToken、refreshToken）
- **API**：`src/api/auth.ts` 提供登录和刷新端点
- **路由守卫**：`src/router/index.ts:43-63` 检查 `meta.requiresAuth`，将未认证用户重定向到 `/login?redirect=<path>`
- Token 在 401 响应时自动刷新（如果 refreshToken 存在）

### API 模块组织
- `src/api/index.ts` - 所有 API 模块的桶导出
- `src/api/http.ts` - 配置好的 axios 实例
- `src/api/auth.ts` - 身份验证端点
- `src/api/plans.ts` - Plans 的增删改查
- `src/api/customers.ts` - Customers 的增删改查
- `src/api/types.ts` - 共享 TypeScript 类型

### 状态管理
- **Pinia stores**：位于 `src/stores/`
- **Auth store**（`src/stores/auth.ts`）：管理 token、用户信息、登录/登出/刷新操作
- **TanStack Query**：用于服务端状态缓存（参考 PlansView.vue 中的 `useQuery` 示例）

### 路由结构
- `/login` - 公共路由（LoginView.vue）
- `/` - MainLayout 包装器，带有 `meta.requiresAuth: true`
  - `/plans` - 默认重定向
  - `/customers`

### 自动导入配置
- Vite 插件（vite.config.ts:11-19）自动导入：
  - Vue Composition API（`vue`）
  - Vue Router 组合式函数
  - Pinia 组合式函数
  - VueUse 工具（`@vueuse/core`）
  - TanStack Query 的 `useQueryClient`
  - Element Plus 组件（按需）
- 生成的类型文件：`src/auto-imports.d.ts`、`src/components.d.ts`

### 路径别名 (vite.config.ts:22-26)
```typescript
'@' → 'src/'
'@api' → 'src/api/'
'@components' → 'src/components/'
```

### 国际化
- `src/locales/i18n.ts` 配置 vue-i18n，使用 Composition API 模式
- 语言文件：`src/locales/en/common.json`、`src/locales/zh/common.json`
- 默认语言：`en`，回退语言：`en`

### 环境变量
- `.env.development` / `.env.production` - 提交到仓库的配置
- `.env.local` - 本地覆盖配置（被 git 忽略）
- 关键变量：`VITE_API_BASE_URL`、`VITE_APP_TITLE`

## 代码规范

### ESLint 配置 (eslint.config.js)
扁平化配置，包含 TypeScript + Vue 规则：
- **Import 排序**：通过 `import/order` 规则自动排序（外部 → 内部 → 父级/同级）
- **未使用的导入**：通过 `unused-imports/no-unused-imports` 自动移除
- **类型导入**：通过 `@typescript-eslint/consistent-type-imports` 强制执行（首选内联风格）
- **显式返回类型**：函数必须声明返回类型（`@typescript-eslint/explicit-function-return-type`）
- **禁止浮动 Promise**：强制执行（`@typescript-eslint/no-floating-promises`）
- **Vue 特定规则**：强制自闭合标签，禁用多词组件名要求

### 测试
- **框架**：Vitest + jsdom + @vue/test-utils
- **位置**：`tests/**/*.spec.ts`
- **Mock 模式**：使用 `vi.mock()` 模拟外部依赖（参考 tests/unit/example.spec.ts 中的 TanStack Query mock）
- **Element Plus**：在测试中使用 stub 组件以避免渲染复杂性

### Git 工作流
- 主分支：`master`
- 提交风格：Conventional Commits（`feat:`、`fix:`、`chore:` 等）
- Pre-commit：Husky + lint-staged 对暂存文件运行 ESLint 和 Prettier
- 推送前运行 `npm run lint && npm run test:unit`

## 重要模式

### 添加新 API 端点
1. 在 `src/api/types.ts` 中定义类型
2. 在 `src/api/<module>.ts` 中创建模块，使用 `http` 客户端
3. 从 `src/api/index.ts` 导出
4. 在视图/组件中使用（优先使用 TanStack Query 进行缓存）

### 添加新路由
1. 在 `src/views/` 中创建视图
2. 在 `src/router/index.ts` 中添加路由
3. 对受保护的路由设置 `meta.requiresAuth: true`
4. 如果使用共享布局，嵌套在 MainLayout 下

### 表单验证
使用 vee-validate + zod schema 验证（参考 LoginView.vue 的模式）

### Token 过期处理
axios 拦截器自动：
1. 检测 401 响应
2. 如果 `refreshToken` 存在且未设置 `_retry`，尝试刷新
3. 用新 token 重试原始请求
4. 如果刷新失败，退出登录并重定向

## 提交与 PR
- 提交信息简洁祈使句，倾向 Conventional Commits（如 `feat:`、`fix:`）。
- PR 需写变更摘要、关联 issue、运行过的命令、UI 改动的截图/GIF；保持单一主题易审阅。

---

## 接口与环境配置（已确认）

### 0. 环境变量配置
**开发环境**：`http://localhost:9090`
**生产环境**：`https://example.com`

**依赖版本策略**：使用最新稳定版本并锁定版本号
```json
{
  "vue": "^3.5.13",           // 锁定小版本，允许 patch 更新
  "element-plus": "^2.9.1",
  "typescript": "^5.6.3"
}
```

### 1. 接口请求格式
- [✓] **请求方式**：所有接口统一使用 POST
- [✓] **查询参数位置**：放在请求体 body 中（选项 A）

**示例**：
```typescript
// 查询订阅列表
POST /api/plans/list
Content-Type: application/json

{
  "pageNum": 1,
  "pageSize": 10,
  "keyword": "test"
}
```

### 2. 错误响应格式
- [✓] **格式**：选项 A - code 非 200 表示业务错误

**成功响应**：
```typescript
{
  code: 200,
  message: "操作成功",
  data: { /* 实际数据 */ }
}
```

**失败响应**：
```typescript
{
  code: 400,  // 或其他错误码：401未授权、403禁止、500服务器错误等
  message: "参数错误",
  data: null
}
```

**响应拦截器处理逻辑**：
```typescript
// 判断 response.data.code
if (code === 200) {
  // 成功，返回 data
  return response.data.data
} else if (code === 401) {
  // Token 过期，尝试刷新
} else {
  // 其他错误，Toast 提示 message
}
```

### 3. Token 刷新接口
- [✓] **接口路径**：`/api/auth/refresh`
- [✓] **请求格式**：选项 A - refreshToken 放在 body 中

**请求示例**：
```typescript
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**响应示例**：
```typescript
{
  code: 200,
  message: "刷新成功",
  data: {
    accessToken: "new_access_token",
    refreshToken: "new_refresh_token"
  }
}
```

**刷新机制**：
1. 响应拦截器捕获 `code === 401`
2. 检查是否有 refreshToken
3. 调用 `/api/auth/refresh` 获取新 token
4. 更新 sessionStorage 和 auth store
5. 重试原始请求（使用新 token）
6. 如果刷新失败，清除会话并跳转登录页

### 4. UI 主题风格（已确认）

#### 风格定位
- **核心风格**：卡通风格，柔和温馨，充满趣味性
- **设计理念**：通过柔和的配色、圆润的圆角、轻盈的动画，打造轻松愉悦的用户体验
- **适用场景**：订阅管理、会员系统、SaaS 平台等需要亲和力的 B2C/B2B 应用

#### 核心配色方案
```css
/* 主色调 */
--color-primary: #ffc94a;        /* 金黄色 - 按钮、强调元素 */
--color-primary-light: #ffd97a;  /* 浅金黄 - hover 状态 */
--color-primary-dark: #ffb347;   /* 深金黄 - 渐变结束色 */

/* 背景色 */
--color-bg-base: #fff7e0;        /* 淡黄色 - 主背景 */
--color-bg-light: #ffecc7;       /* 浅黄色 - 渐变、点缀 */
--color-bg-white: #ffffff;       /* 纯白 - 卡片、表单 */

/* 文字色 */
--color-text-primary: #1f2937;   /* 深灰 - 主文字 */
--color-text-secondary: #6b7280; /* 中灰 - 次要文字 */
--color-text-light: #9ca3af;     /* 浅灰 - 辅助文字 */

/* 功能色 */
--color-success: #10b981;        /* 成功 */
--color-warning: #f59e0b;        /* 警告 */
--color-danger: #ef4444;         /* 危险 */
--color-info: #3b82f6;           /* 信息 */
```

#### 设计元素规范

**1. 圆角（Border Radius）**
```css
--radius-small: 6px;    /* 小元素：标签、徽章 */
--radius-base: 8px;     /* 基础元素：输入框、下拉框 */
--radius-medium: 12px;  /* 中等元素：卡片、按钮、弹窗 */
--radius-large: 16px;   /* 大元素：面板、容器 */
--radius-round: 50%;    /* 圆形：头像、图标按钮 */
```

**2. 阴影（Box Shadow）**
```css
/* 卡片阴影 */
--shadow-card: 0 2px 12px rgba(255, 201, 74, 0.15);
--shadow-card-hover: 0 6px 20px rgba(255, 201, 74, 0.25);

/* 导航栏阴影 */
--shadow-navbar: 0 2px 8px rgba(0, 0, 0, 0.1);

/* 按钮阴影 */
--shadow-button: 0 4px 12px rgba(255, 201, 74, 0.3);
--shadow-button-hover: 0 6px 16px rgba(255, 201, 74, 0.4);

/* 弹窗阴影 */
--shadow-modal: 0 4px 20px rgba(0, 0, 0, 0.15);
```

**3. 渐变（Gradient）**
```css
/* 页面背景渐变 */
background: linear-gradient(135deg, #fff7e0 0%, #ffecc7 100%);

/* 主按钮渐变 */
background: linear-gradient(135deg, #ffc94a 0%, #ffb347 100%);

/* 统计卡片图标背景渐变 */
background: linear-gradient(135deg, #fff7e0 0%, #ffecc7 100%);

/* 表头渐变 */
background: linear-gradient(135deg, #fff7e0 0%, #ffecc7 100%);
```

**4. 动画效果（Transitions & Animations）**
```css
/* 通用过渡 */
transition: all 0.3s ease;

/* 卡片 hover 上浮 */
.card:hover {
  transform: translateY(-4px);
}

/* 按钮 hover 上浮 */
.button:hover {
  transform: translateY(-2px);
}

/* 菜单项滑入 */
.menu-item:hover {
  transform: translateX(4px);
}

/* 头像旋转 */
.avatar:hover {
  transform: scale(1.1) rotate(5deg);
}

/* Loading 旋转动画 */
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Toast 滑入动画 */
@keyframes slideIn {
  from { transform: translateX(400px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
```

#### 组件样式规范

**1. 导航栏（Navbar）**
- 高度：`60px`
- 背景：`#1f2937`（深灰，与主背景形成对比）
- Logo：32x32px 圆角图标 + 金黄色渐变背景
- 语言切换：半透明白色背景，hover 高亮
- 用户头像：36x36px 圆形，金黄色渐变背景，hover 放大旋转

**2. 侧边栏（Sidebar）**
- 宽度：`240px`
- 背景：`rgba(255, 255, 255, 0.7)` + 毛玻璃效果 `backdrop-filter: blur(10px)`
- 菜单项：12px 圆角，hover 滑动动画，激活状态金黄色渐变
- 图标：18px Emoji 或 Element Plus Icons

**3. 卡片（Card）**
- 背景：白色 `#ffffff`
- 圆角：`12px`
- 阴影：`0 2px 12px rgba(255, 201, 74, 0.15)`
- Hover：上浮 4px + 阴影加深 + 金黄色边框

**4. 按钮（Button）**
- 高度：`40px`（默认）、`32px`（小型）
- 圆角：`12px`
- 主按钮：金黄色渐变 + 阴影，hover 上浮 2px
- 次要按钮：白色背景 + 金黄色边框，hover 淡黄色背景
- 危险按钮：红色背景，hover 加深

**5. 表单（Form）**
- 输入框圆角：`8px`
- 边框：默认 `#e5e7eb`，focus 时 `#ffc94a` + 金黄色光晕
- 标签：14px 字体，深灰色，font-weight 500

**6. 表格（Table）**
- 表头背景：淡黄色渐变
- 行 hover：淡黄色背景 `#fff7e0`
- 单元格边框：`#f3f4f6`
- 徽章（Badge）：12px 圆角，成功/警告/危险等状态色

**7. 加载指示器（Loading）**
- 背景遮罩：`rgba(255, 247, 224, 0.9)` + 毛玻璃效果
- Spinner：60x60px，金黄色边框旋转动画
- 最小显示时间：300ms（避免闪烁）

**8. Toast 通知（Toast）**
- 位置：右上角，距离顶部 `80px`、右侧 `24px`
- 背景：白色 + 阴影
- 圆角：`12px`
- 图标：24x24px 圆形，成功绿色/错误红色
- 动画：从右侧滑入，3 秒后自动消失

#### 响应式设计规范

**1. 布局自适应**
- 避免固定高度，使用 `min-height` 和 `flex: 1`
- 内容区域使用 `overflow: auto` 而非 `overflow: scroll`（仅需要时显示滚动条）
- 统计卡片使用 `grid` 布局，自动换行：`grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))`

**2. 断点设计**
```css
/* 桌面端（默认） */
@media (min-width: 1024px) {
  .sidebar { width: 240px; }
  .content { padding: 24px; }
}

/* 平板端 */
@media (max-width: 1023px) and (min-width: 768px) {
  .sidebar { width: 200px; }
  .content { padding: 20px; }
  .stat-card { min-width: 240px; }
}

/* 移动端 */
@media (max-width: 767px) {
  .sidebar { display: none; } /* 隐藏或改为抽屉式 */
  .content { padding: 16px; }
  .navbar { padding: 0 16px; }
  .card-grid { grid-template-columns: 1fr; }
}
```

**3. 防止样式挤压**
- 文字使用 `overflow: hidden; text-overflow: ellipsis; white-space: nowrap;` 处理溢出
- 表格使用 `table-layout: fixed;` + 固定列宽百分比
- 按钮文字不换行，使用 `flex` 布局居中
- 使用 `min-width` 和 `max-width` 限制容器宽度

#### Element Plus 主题覆盖
```scss
// src/styles/element-variables.scss
@forward 'element-plus/theme-chalk/src/common/var.scss' with (
  // 主色调
  $colors: (
    'primary': (
      'base': #ffc94a,
    ),
  ),

  // 圆角
  $border-radius: (
    'base': 8px,
    'small': 6px,
    'round': 20px,
  ),

  // 其他覆盖
  $font-family: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
);

// CSS 变量覆盖
:root {
  --el-color-primary: #ffc94a;
  --el-color-primary-light-3: #ffd97a;
  --el-color-primary-light-5: #ffe9aa;
  --el-color-primary-light-7: #fff3cd;
  --el-color-primary-light-9: #fff9e6;
  --el-border-radius-base: 8px;
  --el-border-radius-small: 6px;
  --el-border-radius-round: 20px;
}
```

#### 图标使用规范
- 优先使用 Emoji 增加趣味性（如 📊📦👥💰等）
- 功能性图标使用 `@element-plus/icons-vue`
- 图标大小：18px（菜单）、20px（卡片）、24px（Toast）
- 图标颜色继承文字色或使用主题色

---

## 项目质量要求

### 代码质量
- 保持高质量代码，注意版本兼容性
- 保持代码结构可扩展性、可读性
- 遵循 Conventional Commits 规范
- 通过 ESLint 和 TypeScript 类型检查
- 完善的单元测试覆盖

### 性能要求
- 路由懒加载，代码分割
- Element Plus 按需导入
- Loading 最小显示时间 300ms（避免闪烁）
- 使用 TanStack Query 缓存优化请求

### 用户体验
- 界面无滚动条（通过自适应布局）
- 响应式设计，防止窗口大小变化挤乱样式
- 全局 Loading 带时间阈值
- Toast 通知统一错误提示
- 右上角语言切换功能

### 部署方式
- Nginx 手动部署静态网站
- 生产构建优化
- 提供 Nginx 配置示例

### 业务范围
- 暂不考虑具体业务逻辑
- 搭建基础框架和示例页面（Dashboard、订阅中心）
- 提供可扩展的架构基础

---

## 项目搭建计划

按以下阶段逐步搭建：

### 第一阶段：项目初始化
1. 初始化 Vite + Vue 3 + TypeScript 项目
2. 安装核心依赖
   - Vue Router
   - Pinia
   - Element Plus
   - TanStack Query
   - vue-i18n
   - axios
   - vee-validate + zod
3. 配置开发工具
   - ESLint（扁平化配置）
   - Prettier
   - Husky + lint-staged
   - Vitest

### 第二阶段：基础架构
1. **HTTP 客户端**（`src/api/http.ts`）
   - axios 实例配置（15s 超时）
   - 请求拦截器（自动附加 token）
   - 响应拦截器（401 自动刷新 + 统一错误处理）
2. **状态管理**（`src/stores/`）
   - auth store（token 管理 + 登录/登出/刷新）
3. **路由配置**（`src/router/index.ts`）
   - 路由守卫（认证检查）
   - 登录重定向
4. **国际化**（`src/locales/`）
   - 中英文配置
   - Element Plus 语言包同步

### 第三阶段：核心功能
1. **登录认证流程**
   - 登录页（vee-validate + zod 验证）
   - Token 双重刷新机制
   - sessionStorage 持久化
2. **全局组件**
   - Loading 指示器（带时间阈值，避免闪烁）
   - Toast 通知（错误提示）
   - 语言切换（右上角）
3. **主布局**（MainLayout）
   - 顶部导航栏
   - 侧边栏菜单
   - 内容区域

### 第四阶段：示例页面
1. **Dashboard**
   - 数据统计卡片
   - 图表展示（可选：ECharts）
2. **订阅中心**
   - 订阅列表（表格）
   - 增删改查操作
   - TanStack Query 缓存示例

### 第五阶段：优化配置
1. **性能优化**
   - 路由懒加载
   - Element Plus 按需导入
   - 代码分割
2. **质量保证**
   - 单元测试示例
   - E2E 测试配置（可选）
3. **生产构建**
   - 构建优化
   - Nginx 部署配置示例