# Cloudflare Pages 部署指南

本文档详细说明如何将比特币100万美元倒计时器部署到Cloudflare Pages。

## 为什么选择Cloudflare Pages

- 🚀 **全球CDN加速** - 200+个数据中心，访问速度极快
- 🔒 **免费SSL证书** - 自动HTTPS，安全可靠
- 📊 **实时分析** - 访问统计和性能监控
- 🛡️ **DDoS防护** - 企业级安全防护
- 💰 **完全免费** - 每月500次构建，100GB带宽
- 🌐 **自定义域名** - 支持绑定个人域名

## 部署方法

### 方法一：Git集成部署（推荐）

1. **登录Cloudflare Dashboard**
   - 访问 [dash.cloudflare.com](https://dash.cloudflare.com)
   - 登录或注册Cloudflare账户

2. **创建Pages项目**
   - 点击左侧菜单 "Pages"
   - 点击 "Create a project"
   - 选择 "Connect to Git"

3. **连接GitHub仓库**
   - 授权Cloudflare访问GitHub
   - 选择仓库 `lovexw/btc100`
   - 点击 "Begin setup"

4. **配置构建设置**
   ```
   Project name: btc100
   Production branch: main
   Build command: (留空)
   Build output directory: /
   Root directory: /
   ```

5. **部署项目**
   - 点击 "Save and Deploy"
   - 等待部署完成（通常1-2分钟）

6. **获取访问地址**
   - 部署完成后获得地址：`https://btc100.pages.dev`
   - 或自定义域名：`https://你的域名.com`

### 方法二：直接上传部署

1. **准备文件**
   ```bash
   # 下载项目文件
   git clone https://github.com/lovexw/btc100.git
   cd btc100
   ```

2. **创建Pages项目**
   - 在Cloudflare Dashboard中选择 "Pages"
   - 点击 "Create a project"
   - 选择 "Upload assets"

3. **上传文件**
   - 将 `index.html`, `style.css`, `script.js` 打包成zip
   - 拖拽上传到Cloudflare Pages
   - 设置项目名称：`btc100`

4. **完成部署**
   - 点击 "Deploy site"
   - 获得访问地址

## 自定义域名配置

### 添加自定义域名

1. **在Pages项目中添加域名**
   - 进入项目设置
   - 点击 "Custom domains"
   - 点击 "Set up a custom domain"

2. **配置DNS记录**
   ```
   类型: CNAME
   名称: www (或 @)
   目标: btc100.pages.dev
   ```

3. **等待DNS生效**
   - 通常需要几分钟到几小时
   - 可使用 `dig` 命令检查：
   ```bash
   dig www.你的域名.com
   ```

### SSL证书配置

Cloudflare会自动为自定义域名提供SSL证书，无需手动配置。

## 环境变量配置

虽然本项目是纯前端项目，但如果需要配置环境变量：

1. **在项目设置中添加**
   - 进入 "Settings" > "Environment variables"
   - 添加变量（如API密钥等）

2. **在代码中使用**
   ```javascript
   // 注意：前端环境变量会暴露给用户
   const apiKey = process.env.API_KEY;
   ```

## 性能优化配置

### 缓存规则设置

1. **页面规则配置**
   ```
   URL模式: *.css
   缓存级别: 缓存所有内容
   边缘缓存TTL: 1个月
   
   URL模式: *.js
   缓存级别: 缓存所有内容
   边缘缓存TTL: 1个月
   
   URL模式: *.html
   缓存级别: 缓存所有内容
   边缘缓存TTL: 1小时
   ```

### 压缩设置

Cloudflare自动启用Gzip和Brotli压缩，无需额外配置。

### 安全设置

1. **启用安全功能**
   - Always Use HTTPS: 开启
   - HSTS: 开启
   - Security Level: Medium

2. **防火墙规则**
   ```
   # 阻止恶意爬虫
   (cf.bot_management.score lt 30)
   Action: Block
   ```

## 监控和分析

### Web Analytics

1. **启用分析**
   - 在Pages项目中启用 "Web Analytics"
   - 获得详细的访问统计

2. **关键指标监控**
   - 页面浏览量
   - 独立访客数
   - 地理分布
   - 设备类型

### 性能监控

```javascript
// 添加性能监控代码
window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0];
    console.log('页面加载时间:', perfData.loadEventEnd - perfData.fetchStart);
});
```

## 故障排除

### 常见问题

1. **部署失败**
   - 检查文件结构是否正确
   - 确认没有语法错误
   - 查看构建日志

2. **API调用失败**
   - 确认HTTPS环境
   - 检查CORS设置
   - 验证API端点可用性

3. **自定义域名不生效**
   - 检查DNS配置
   - 等待DNS传播
   - 清除浏览器缓存

### 调试工具

1. **Cloudflare Dashboard**
   - 实时日志查看
   - 错误统计分析
   - 性能指标监控

2. **浏览器开发者工具**
   - Network面板检查请求
   - Console查看错误信息
   - Performance分析加载性能

## 成本说明

### 免费额度
- 每月500次构建
- 100GB带宽
- 无限静态请求
- 基础DDoS防护

### 付费功能
- 更多构建次数：$5/月
- 高级分析：$5/月
- 优先支持：$20/月

## 最佳实践

1. **代码优化**
   - 压缩CSS和JavaScript
   - 优化图片资源
   - 使用现代浏览器特性

2. **SEO优化**
   ```html
   <!-- 添加meta标签 -->
   <meta name="description" content="比特币100万美元倒计时器">
   <meta name="keywords" content="比特币,BTC,预测,100万美元">
   ```

3. **安全考虑**
   - 定期更新依赖
   - 避免暴露敏感信息
   - 使用HTTPS

## 自动化部署

### GitHub Actions集成

```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: btc100
          directory: ./
```

## 联系支持

如果在部署过程中遇到问题：

- **Cloudflare文档**: [developers.cloudflare.com](https://developers.cloudflare.com)
- **社区支持**: [community.cloudflare.com](https://community.cloudflare.com)
- **项目作者**: 
  - 个人主页: https://xiaowuleyi.com
  - 公众号: 比特囤币

---

## 免责声明

1. **本网站仅为娱乐目的**
   
   本项目纯属个人兴趣开发，旨在通过技术手段展示比特币价格预测的可能性。所有数据和预测仅供娱乐参考，不构成任何形式的投资建议或财务指导。

2. **预测基于保守估计**
   
   根据互联网上对比特币的普遍估值分析和各大机构的预测报告，我们选择2033年作为比特币达到100万美元的目标时间点。这是一个相对保守的估计，考虑了市场周期性、技术发展、监管环境等多重因素。当然，加密货币市场充满不确定性，实际情况可能会超出或低于预期，让我们拭目以待这一历史性时刻的到来。

3. **坚持长期价值投资理念**
   
   在加密货币的世界里，短期波动是常态，但长期趋势更值得关注。我们倡导"坚持囤币，穿越周期"的投资哲学——即通过长期持有优质数字资产，跨越市场的牛熊周期，最终获得时间复利的回报。这不仅是一种投资策略，更是对区块链技术和数字经济未来的坚定信念。

**风险提示**: 数字货币投资存在极高风险，价格波动剧烈，可能面临全部损失。请根据自身风险承受能力谨慎投资，切勿投入超过自己承受范围的资金。