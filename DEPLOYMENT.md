# Bitcoin $1M - Cloudflare 部署指南

## 项目简介

**Bitcoin $1M Journey** 是一个为比特币长期投资者设计的娱乐工具，展示实时比特币价格和距离100万美元目标的差距。

### 技术栈
- React 18
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React Icons

## 本地开发

### 前置条件
- Node.js 16+ 
- npm 或 yarn

### 安装和运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

开发服务器默认运行在 `http://localhost:5173`

## 部署到 Cloudflare Pages

### 方案 A: 使用 Cloudflare Pages UI（推荐）

#### 第一步：准备 Git 仓库
1. 将项目上传到 GitHub/GitLab/Gitea
2. 确保有 `feat-rebuild-btc-1m-landing-cloudflare-docs` 分支或切换到主分支

#### 第二步：连接 Cloudflare Pages
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 选择 **Pages** 
3. 点击 **Create a project**
4. 选择 **Connect to Git**
5. 授权并选择你的仓库

#### 第三步：配置构建设置
在 Cloudflare Pages 中配置以下内容：

- **Project name**: `bitcoin-1m` (或任意名称)
- **Production branch**: `feat-rebuild-btc-1m-landing-cloudflare-docs`
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory (advanced)**: `/` (默认)

#### 第四步：设置环境变量（如果需要）
目前此项目不需要环境变量，如果需要添加，在 Pages 项目设置中的 **Settings > Environment variables** 添加。

#### 第五步：部署
1. 点击 **Save and Deploy**
2. Cloudflare 会自动开始构建和部署
3. 几分钟后访问生成的 URL

### 方案 B: 使用 Cloudflare CLI (Wrangler)

#### 第一步：安装 Wrangler
```bash
npm install -g wrangler
```

#### 第二步：登录 Cloudflare
```bash
wrangler login
```
浏览器会打开授权页面，授权后返回终端。

#### 第三步：构建项目
```bash
npm run build
```

#### 第四步：部署
```bash
wrangler pages deploy dist --project-name bitcoin-1m
```

### 方案 C: 使用 wrangler.toml (高级)

创建 `wrangler.toml` 文件：

```toml
name = "bitcoin-1m"
type = "javascript"
account_id = "your_account_id"
workers_dev = true
route = ""
zone_id = ""

[env.production]
name = "bitcoin-1m-prod"
route = "example.com/*"
zone_id = "your_zone_id"

[build]
command = "npm run build"
cwd = "./"
watch_paths = ["src/**/*.jsx"]

[build.upload]
format = "service-worker"
```

然后运行：
```bash
wrangler pages deploy dist
```

## 自定义域名

部署完成后，你可以绑定自定义域名：

1. 在 Cloudflare Pages 项目中，选择 **Custom domains**
2. 点击 **Add a domain**
3. 输入你的域名
4. 按照提示配置 DNS 或使用 Cloudflare 的 nameserver

## 性能优化

此项目已针对 Cloudflare Pages 优化：

- ✅ 使用 Vite 进行快速构建
- ✅ 静态资源会自动压缩和缓存
- ✅ Tailwind CSS 已优化，只包含使用的样式
- ✅ React 代码分割支持

### 额外优化建议

#### 启用缓存
在 Cloudflare Dashboard 中：
1. 选择你的域名
2. **Caching > Cache Rules**
3. 创建规则缓存 `/` 和其他静态资源（TTL: 1小时以上）

#### 启用压缩
1. **Speed > Optimization**
2. 启用 **Brotli** 和 **Gzip** 压缩

#### 启用安全功能
1. **Security > Settings**
2. 启用 **Bot Management**（可选）
3. 配置 **WAF Rules**（可选）

## 更新和维护

### 自动部署
当你推送代码到连接的分支时，Cloudflare Pages 会自动构建和部署。

### 手动回滚
1. 在 Cloudflare Pages 项目中选择 **Deployments**
2. 找到你想要回滚的部署
3. 点击 **Rollback**

### 查看构建日志
在 **Deployments** 选项卡中，点击部署查看完整的构建日志。

## 常见问题

### Q: 构建失败？
**A:** 检查：
- Node.js 版本是否为 16+
- `package.json` 中的依赖是否正确
- 构建命令是否为 `npm run build`
- 输出目录是否为 `dist`

### Q: 白屏显示？
**A:** 
- 检查浏览器控制台是否有错误
- 确保所有组件文件都已正确创建
- 清除浏览器缓存并硬刷新（Ctrl+Shift+R）

### Q: API 请求失败？
**A:**
- 比特币价格 API 来自 CoinGecko（免费、无需 API Key）
- 如果被限流，考虑使用其他 API（如 CoinMarketCap）
- 在浏览器开发者工具中检查网络请求

### Q: 如何自定义页面内容？
**A:** 编辑以下文件：
- `src/components/Hero.jsx` - 首页文本
- `src/components/Philosophy.jsx` - 投资理念部分
- `src/components/Features.jsx` - 功能说明

## 环境变量（扩展用途）

如果需要使用环境变量（例如自定义 API 端点），在 Pages 项目设置中添加：

```
VITE_API_URL=https://your-api.com
VITE_TARGET_PRICE=1000000
```

在代码中使用：
```javascript
const apiUrl = import.meta.env.VITE_API_URL
const targetPrice = import.meta.env.VITE_TARGET_PRICE
```

## 监控和分析

### 集成 Cloudflare Analytics
1. Pages 项目会自动记录访问统计
2. 在 **Analytics** 标签查看页面访问情况

### 集成第三方分析（可选）
可以添加 Google Analytics 或其他服务，修改 `index.html`：

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 项目结构

```
bitcoin-1m/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # 页面顶部导航
│   │   ├── Hero.jsx            # 首屏展示
│   │   ├── BitcoinTracker.jsx  # 核心价格追踪器
│   │   ├── Philosophy.jsx      # 投资理念展示
│   │   ├── Features.jsx        # 功能介绍
│   │   └── Footer.jsx          # 页脚
│   ├── App.jsx                 # 主应用组件
│   ├── main.jsx                # 入口文件
│   └── index.css               # 全局样式
├── index.html                  # HTML 模板
├── package.json               # 项目配置
├── vite.config.js            # Vite 配置
├── tailwind.config.js        # Tailwind 配置
├── postcss.config.js         # PostCSS 配置
└── DEPLOYMENT.md             # 本文档
```

## 安全考虑

- ✅ 不存储任何用户数据
- ✅ 所有 API 调用都通过公开的免费 API（CoinGecko）
- ✅ 静态网站，无后端服务器风险
- ✅ 支持 HTTPS（Cloudflare 自动提供）

## 贡献和改进

欢迎提交 Issue 和 Pull Request！

### 可能的改进方向
- [ ] 添加多种价格单位支持（CNY, EUR, 等）
- [ ] 添加价格图表历史
- [ ] 添加通知功能（达到特定价格时）
- [ ] 添加多语言支持
- [ ] 添加离线访问支持（PWA）

## 许可证

MIT License - 自由使用和修改

## 支持

如有问题，请：
1. 查看项目中的 GitHub Issues
2. 提交新的 Issue 描述问题
3. 在 Cloudflare Discord 社区寻求帮助

---

**最后更新**: 2024年
**项目名称**: Bitcoin $1M Journey
**部署平台**: Cloudflare Pages
