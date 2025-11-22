# 🚀 快速开始指南

欢迎使用 **Bitcoin $1M**！本指南会帮助你快速上手。

## ⚡ 30秒快速开始

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 打开浏览器，访问 http://localhost:5173
```

就这么简单！✨

## 📁 项目结构速览

```
src/
├── components/         # 所有 React 组件
│   ├── Header.jsx     # 顶部导航
│   ├── Hero.jsx       # 首屏展示
│   ├── BitcoinTracker.jsx  # 💎 核心功能（比特币价格追踪）
│   ├── Philosophy.jsx # 投资理念
│   ├── Features.jsx   # 功能说明
│   └── Footer.jsx     # 页脚
├── App.jsx            # 主应用
├── main.jsx           # 入口
└── index.css          # 全局样式
```

## 🎯 3个常见任务

### 任务1：修改目标价格
编辑 `src/components/BitcoinTracker.jsx`：
```javascript
const TARGET_PRICE = 1000000  // 改成你想要的价格
```

### 任务2：修改首页文本
编辑 `src/components/Hero.jsx`：
```jsx
<h1>修改这里的标题</h1>
<p>修改这里的描述</p>
```

### 任务3：修改投资理念内容
编辑 `src/components/Philosophy.jsx`，修改 `principles` 数组中的内容。

## 🚀 5步部署到 Cloudflare

**最简单的方式：**

1. 项目推送到 GitHub
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
3. 进入 **Pages**，点击 **Create a project**
4. 选择 **Connect to Git**，选择你的仓库
5. 配置如下：
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
6. 点击 **Save and Deploy**，完成！✅

详见 [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🛠️ 常用命令

```bash
# 开发
npm run dev          # 启动开发服务器

# 生产
npm run build        # 构建为生产版本
npm run preview      # 预览构建结果

# 代码质量
npm run lint         # 检查代码问题
```

## 🎨 修改样式

所有样式使用 **Tailwind CSS**，直接在组件中使用类名：

```jsx
<div className="bg-blue-500 text-white p-4 rounded-lg">
  这是一个蓝色的盒子
</div>
```

修改配置，编辑 `tailwind.config.js`

## 📊 修改 API 数据来源

当前使用 **CoinGecko API**（免费，无需密钥）

若要更换 API，编辑 `src/components/BitcoinTracker.jsx`：

```javascript
// 找到这一行，替换为你的 API
const response = await fetch(
  'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
)
```

**推荐的免费 API：**
- CoinGecko - 最可靠，无需密钥 ⭐
- CoinMarketCap - 需要免费 API Key
- Kraken - 交易所 API

## 🔧 调试技巧

### 页面显示白屏？
1. 打开浏览器开发者工具 (F12)
2. 查看 **Console** 标签，看是否有红色错误
3. 尝试硬刷新 (Ctrl+Shift+R)

### 价格不更新？
1. 打开 **Network** 标签
2. 查看 `/api/v3/simple/price` 请求是否失败
3. 检查网络连接
4. CoinGecko 可能被限流，稍后重试

### 样式显示不正确？
1. 确认有运行 `npm install`
2. Tailwind CSS 需要完整编译
3. 检查类名是否拼写正确

## 📱 响应式设计测试

打开浏览器开发者工具 (F12)，选择不同设备模拟器测试：
- 📱 iPhone (375px)
- 📱 iPad (768px)
- 🖥️ Desktop (1920px)

## 🌐 本地化/国际化

当前所有文本都是中文。若要添加其他语言，建议：

1. 创建 `src/i18n.js` 处理翻译
2. 创建 `src/locales/zh.json` 和 `src/locales/en.json`
3. 在组件中使用翻译函数

## 🎯 下一步

- 📖 完整文档：[README.md](./README.md)
- 🚀 部署指南：[DEPLOYMENT.md](./DEPLOYMENT.md)
- 💬 提问？查看项目的 Issues 和 Discussions

## 💡 有用的链接

- [React 官方文档](https://react.dev/)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Vite 文档](https://vitejs.dev/)
- [CoinGecko API](https://www.coingecko.com/en/api/documentation)

## 🎉 祝贺！

你现在已经了解了这个项目的基本情况。开始修改代码，看看会发生什么吧！

---

有问题？查看 [README.md](./README.md) 获取更多帮助！ 🚀
