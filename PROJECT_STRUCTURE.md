# 📁 项目结构详解

本文档详细说明了 **Bitcoin $1M** 项目的文件和目录结构。

## 完整的项目树

```
bitcoin-1m/
│
├── src/                              # 源代码目录
│   ├── components/                  # React 组件
│   │   ├── Header.jsx              # 顶部导航栏组件
│   │   ├── Hero.jsx                # 首屏英雄区块组件
│   │   ├── BitcoinTracker.jsx      # 核心价格追踪器组件 ⭐
│   │   ├── Philosophy.jsx          # 投资理念展示组件
│   │   ├── Features.jsx            # 功能介绍组件
│   │   └── Footer.jsx              # 页脚组件
│   │
│   ├── App.jsx                     # 主应用容器组件
│   ├── main.jsx                    # 应用入口文件
│   └── index.css                   # 全局样式 + Tailwind imports
│
├── public/                          # 静态资源（不会被处理）
│   └── vite.svg                    # Vite logo (可删除)
│
├── dist/                            # 构建输出目录 (部署使用)
│   ├── index.html
│   └── assets/
│       ├── index-*.css
│       └── index-*.js
│
├── node_modules/                    # 依赖包目录 (.gitignore)
│
├── 📄 核心配置文件
│   ├── package.json                # 项目配置、依赖、脚本
│   ├── package-lock.json           # npm 锁定文件
│   ├── index.html                  # HTML 入口模板
│   ├── vite.config.js              # Vite 构建配置
│   ├── tailwind.config.js          # Tailwind CSS 配置
│   ├── postcss.config.js           # PostCSS 处理器配置
│   └── .eslintrc.js               # ESLint 代码检查配置
│
├── 🚀 部署相关
│   ├── wrangler.toml              # Wrangler CLI 配置
│   ├── _redirects                 # Cloudflare Pages URL 重定向
│   └── _headers                   # Cloudflare Pages HTTP 头部
│
├── 📚 文档
│   ├── README.md                  # 项目主文档 ⭐⭐⭐
│   ├── DEPLOYMENT.md              # Cloudflare 部署指南 ⭐⭐
│   ├── QUICKSTART.md              # 快速开始指南
│   ├── CONTRIBUTING.md            # 贡献指南
│   ├── PROJECT_STRUCTURE.md       # 本文件
│   ├── CHANGELOG.md               # 版本变更日志
│   └── LICENSE                    # MIT 许可证
│
├── 🔧 配置相关
│   ├── .gitignore                 # Git 忽略规则
│   └── .env.example               # 环境变量示例
│
└── .git/                            # Git 版本控制（隐藏目录）
```

## 📂 关键目录说明

### `src/` - 源代码目录

存放所有应用源代码。

#### `src/components/` - React 组件

所有 React 组件都在此目录。每个文件对应一个组件。

| 文件 | 用途 | 说明 |
|------|------|------|
| `Header.jsx` | 页面顶部导航 | 包含菜单链接、品牌标志 |
| `Hero.jsx` | 首屏展示 | 主标题、副标题、行动按钮 |
| `BitcoinTracker.jsx` | 价格追踪器 | 核心功能：显示 BTC 价格、进度等 |
| `Philosophy.jsx` | 投资理念 | 6 个核心投资原则展示 |
| `Features.jsx` | 功能介绍 | 应用的 4 个主要功能说明 |
| `Footer.jsx` | 页脚 | 链接、免责声明、版权信息 |

#### `src/App.jsx` - 主应用组件

```jsx
// 组件树结构
<App>
  <Header />
  <Hero />
  <BitcoinTracker />  // 核心业务组件
  <Philosophy />
  <Features />
  <Footer />
</App>
```

- 包含全局样式和背景动画
- 管理整个页面的布局

#### `src/main.jsx` - 入口文件

```jsx
// 初始化 React 和 ReactDOM
ReactDOM.createRoot(document.getElementById('root'))
  .render(<App />)
```

#### `src/index.css` - 全局样式

```css
@tailwind base;      // Tailwind 基础样式
@tailwind components; // Tailwind 组件样式
@tailwind utilities; // Tailwind 工具类

/* 自定义全局样式 */
.gradient-text { /* ... */ }
.glass-effect { /* ... */ }
```

### `dist/` - 构建输出目录

包含构建后的生产文件。**不应提交到 Git**。

```
dist/
├── index.html              # 压缩后的 HTML
└── assets/
    ├── index-mYo3xrg3.css # Tailwind 编译的 CSS (3.9KB gzip)
    └── index-8k2eDjQm.js  # 编译的 JavaScript (52.7KB gzip)
```

### `public/` - 静态资源

直接复制到 `dist/` 的文件，不被处理。

用于存放：
- favicon
- logo
- 静态图片
- robots.txt

### `.git/` - Git 版本控制

Git 仓库元数据。**不可删除**，不需要修改。

## 📄 配置文件详解

### `package.json`

项目配置和依赖管理。

```json
{
  "name": "bitcoin-1m-journey",
  "version": "0.0.0",
  "type": "module",  // ES 模块
  "scripts": {
    "dev": "vite",           // 开发命令
    "build": "vite build",   // 构建命令
    "preview": "vite preview" // 预览命令
  },
  "dependencies": {
    "react": "^18.2.0",      // React 库
    "framer-motion": "^11.0.0" // 动画库
  }
}
```

### `vite.config.js`

Vite 构建工具配置。

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()]  // 使用 React 插件
})
```

### `tailwind.config.js`

Tailwind CSS 配置。

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // 扫描的文件
  ],
  theme: {
    extend: {
      colors: {
        bitcoin: '#F7931A'  // 自定义比特币颜色
      }
    }
  }
}
```

### `postcss.config.js`

PostCSS 处理器配置。

```javascript
export default {
  plugins: {
    tailwindcss: {},  // Tailwind CSS
    autoprefixer: {}  // 自动添加浏览器前缀
  }
}
```

### `.eslintrc.js`

代码检查规则。

### `index.html`

HTML 入口模板。

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>Bitcoin $1M - 百万美元之路</title>
</head>
<body>
  <div id="root"></div>  <!-- React 将挂载到此 -->
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

## 🚀 部署相关文件

### `_redirects`

URL 重定向规则（Cloudflare Pages）。

```
/*  /index.html  200
```

这允许 React Router 正确处理所有路由。

### `_headers`

HTTP 响应头配置（Cloudflare Pages）。

```
/*
  Cache-Control: public, max-age=3600
  X-Frame-Options: SAMEORIGIN
```

配置缓存、安全头等。

### `wrangler.toml`

Wrangler CLI（Cloudflare 官方工具）配置。

```toml
name = "bitcoin-1m"
type = "javascript"

[build]
command = "npm run build"
cwd = "./"
```

## 📚 文档文件

| 文件 | 用途 |
|------|------|
| `README.md` ⭐⭐⭐ | 项目主文档，新手必读 |
| `DEPLOYMENT.md` ⭐⭐ | 详细的 Cloudflare 部署指南 |
| `QUICKSTART.md` | 30 秒快速开始指南 |
| `CONTRIBUTING.md` | 贡献指南，如何参与开发 |
| `PROJECT_STRUCTURE.md` | 本文件，项目结构说明 |
| `CHANGELOG.md` | 版本历史和变更记录 |
| `LICENSE` | MIT 许可证 |

## 🔧 配置文件

| 文件 | 用途 |
|------|------|
| `.gitignore` | Git 忽略规则 |
| `.env.example` | 环境变量示例 |
| `.eslintrc.js` | ESLint 代码检查配置 |

## 📊 依赖关系图

```
index.html
    ↓
main.jsx (入口)
    ↓
App.jsx (主组件)
    ├── Header.jsx
    ├── Hero.jsx
    ├── BitcoinTracker.jsx ⭐
    │   └── CoinGecko API
    ├── Philosophy.jsx
    ├── Features.jsx
    └── Footer.jsx

全局导入：
├── React 18
├── Tailwind CSS
├── Framer Motion (可选动画)
├── Lucide React (图标)
└── index.css (全局样式)
```

## 🔄 数据流

```
1. 用户访问 index.html
   ↓
2. 加载 src/main.jsx
   ↓
3. 挂载 src/App.jsx
   ↓
4. 渲染各个组件
   ↓
5. BitcoinTracker 组件
   ├── 初始化时调用 fetchBTCPrice()
   │   └── 发送 API 请求到 CoinGecko
   ├── 更新状态
   ├── 重新渲染
   └── 每分钟自动刷新一次
```

## 💾 文件大小统计

| 部分 | 大小（未压缩） | 大小（Gzip） |
|------|---|---|
| HTML | 1.44 KB | 0.89 KB |
| CSS | 15.5 KB | 3.9 KB |
| JS | 163.96 KB | 52.77 KB |
| **总计** | **180.9 KB** | **57.56 KB** |

> ✅ 所有资源都小于 200KB，可以在 1 秒内加载

## 🚀 开发工作流

```
修改代码
  ↓
npm run dev (开发服务器实时更新)
  ↓
保存文件
  ↓
浏览器自动刷新 (HMR)
  ↓
测试完成
  ↓
npm run build (生产构建)
  ↓
npm run preview (本地预览)
  ↓
git push (推送代码)
  ↓
Cloudflare 自动部署 (CI/CD)
```

## 📱 支持的浏览器

项目构建针对以下浏览器：

- Chrome/Edge: 最新 2 个版本
- Firefox: 最新 2 个版本
- Safari: 最新 2 个版本
- iOS Safari: 最新 2 个版本

## ⚙️ 构建过程

```
源代码 (src/)
  ↓
Babel 转译 (ES6+ → ES5)
  ↓
Rollup 打包
  ↓
Tailwind 编译
  ↓
代码压缩和优化
  ↓
生成哈希文件名 (cache busting)
  ↓
输出到 dist/
```

## 🔐 安全考虑

- `_headers` 配置 CSP 和其他安全头
- `.gitignore` 防止提交敏感文件
- `.env.example` 提供环境变量模板
- 无 eval() 代码执行风险

## 🎯 关键路径

**如果要...**

| 任务 | 文件 |
|------|------|
| 修改首页文字 | `src/components/Hero.jsx` |
| 修改样式 | `src/components/*.jsx` + `src/index.css` |
| 修改 API 数据源 | `src/components/BitcoinTracker.jsx` |
| 修改目标价格 | `src/components/BitcoinTracker.jsx` |
| 修改菜单链接 | `src/components/Header.jsx` |
| 修改投资理念 | `src/components/Philosophy.jsx` |
| 修改功能列表 | `src/components/Features.jsx` |
| 部署到 Cloudflare | `DEPLOYMENT.md` |

---

**需要帮助？** 查看 [QUICKSTART.md](./QUICKSTART.md) 或 [README.md](./README.md) 👍
