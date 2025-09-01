# 比特币100万美元倒计时器

一个基于实时API数据的比特币价格预测和倒计时网站，预测比特币在2033年达到100万美元的目标。

## 项目特点

- 🚀 实时比特币价格获取（CoinGecko API）
- 📊 交互式K线图表显示历史和预测数据
- ⏱️ 秒表效果的价格显示动画
- 📱 响应式设计，支持移动设备
- 🎯 2033年100万美元目标预测
- 💰 无需API密钥，完全免费使用

## 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **API**: CoinGecko免费API
- **图表**: 原生Canvas绘制
- **样式**: 纯CSS动画和渐变效果

## 文件结构

```
btc100M/
├── index.html          # 主页面
├── style.css           # 样式文件
├── script.js           # JavaScript逻辑
└── README.md           # 说明文档
```

## 部署指南

### 方法一：GitHub Pages 部署

1. **Fork 或 Clone 仓库**
   ```bash
   git clone https://github.com/lovexw/btc100.git
   cd btc100
   ```

2. **推送到你的GitHub仓库**
   ```bash
   git remote set-url origin https://github.com/你的用户名/btc100.git
   git push -u origin main
   ```

3. **启用GitHub Pages**
   - 进入仓库设置 (Settings)
   - 找到 "Pages" 选项
   - Source 选择 "Deploy from a branch"
   - Branch 选择 "main"
   - 点击 Save

4. **访问网站**
   - 网站将在 `https://你的用户名.github.io/btc100` 可用

### 方法二：Vercel 部署

1. **安装Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **部署项目**
   ```bash
   cd btc100
   vercel
   ```

3. **按提示配置**
   - 选择项目名称
   - 确认部署设置
   - 获得部署URL

### 方法三：Netlify 部署

1. **拖拽部署**
   - 访问 [netlify.com](https://netlify.com)
   - 将项目文件夹拖拽到部署区域

2. **Git集成部署**
   - 连接GitHub仓库
   - 选择分支 (main)
   - 自动部署

### 方法四：传统Web服务器

1. **上传文件**
   ```bash
   # 将所有文件上传到web服务器根目录
   scp -r * user@server:/var/www/html/
   ```

2. **配置Web服务器**
   - 确保支持静态文件服务
   - 配置HTTPS（推荐）
   - 设置适当的缓存头

## 环境要求

- **浏览器支持**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **网络要求**: 需要访问外部API (api.coingecko.com)
- **HTTPS**: 推荐使用HTTPS以确保API调用正常

## 配置选项

### API配置
项目使用CoinGecko免费API，无需配置API密钥。如需修改API源：

```javascript
// 在 script.js 中修改
const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
```

### 目标价格配置
```javascript
// 在 script.js 中修改目标价格
this.targetPrice = 1000000; // 100万美元
this.targetDate = new Date('2033-12-31T23:59:59'); // 目标日期
```

### 更新频率配置
```javascript
// 修改价格更新频率（默认5分钟）
setInterval(() => {
    this.fetchCurrentPrice();
}, 5 * 60 * 1000); // 5分钟 = 300000毫秒
```

## 性能优化

1. **启用Gzip压缩**
   ```nginx
   # Nginx配置
   gzip on;
   gzip_types text/css application/javascript;
   ```

2. **设置缓存头**
   ```nginx
   # 静态资源缓存
   location ~* \.(css|js|html)$ {
       expires 1h;
       add_header Cache-Control "public, immutable";
   }
   ```

3. **CDN加速**
   - 使用Cloudflare等CDN服务
   - 启用自动压缩和缓存

## 故障排除

### API访问问题
- 检查网络连接
- 确认CORS设置
- 验证API端点可用性

### 显示异常
- 检查浏览器控制台错误
- 确认JavaScript文件加载
- 验证CSS样式应用

### 移动端适配
- 检查viewport设置
- 测试触摸交互
- 验证响应式布局

## 监控和维护

### 日志监控
```javascript
// 添加错误监控
window.addEventListener('error', (e) => {
    console.error('页面错误:', e.error);
});
```

### 性能监控
```javascript
// 监控API响应时间
const startTime = performance.now();
// ... API调用
const endTime = performance.now();
console.log(`API响应时间: ${endTime - startTime}ms`);
```

## 许可证

本项目仅供娱乐和学习使用，不构成投资建议。

## 联系信息

- **仓库地址**: https://github.com/lovexw/btc100
- **个人主页**: https://xiaowuleyi.com
- **公众号**: 比特囤币

## 免责声明

1. 本网站仅为娱乐
2. 根据互联网对比特币的普遍估值和预测，2033年为保守估计，我们拭目以待
3. 坚持囤币，穿越周期