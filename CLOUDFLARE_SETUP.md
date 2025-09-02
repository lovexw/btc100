# Cloudflare 配置详细说明

## 🎯 项目概述

这个比特币价格追踪器专为 Cloudflare 平台设计，具有以下特点：

- ✅ **自动定时获取**: 每小时自动获取比特币价格
- ✅ **永久存储**: 使用 Cloudflare KV 存储数据
- ✅ **全球加速**: Cloudflare CDN 确保快速访问
- ✅ **中国优化**: 专门优化了国内网络访问

## 🚀 一键部署步骤

### 方法一：使用部署脚本（推荐）

1. **克隆项目**
```bash
git clone <your-repo-url>
cd btc100M
```

2. **运行部署脚本**
```bash
./deploy.sh
```

3. **按提示完成配置**
   - 登录 Cloudflare 账户
   - 创建 KV 命名空间
   - 更新配置文件

### 方法二：手动部署

1. **安装 Wrangler CLI**
```bash
npm install -g wrangler
```

2. **登录 Cloudflare**
```bash
wrangler login
```

3. **创建 KV 命名空间**
```bash
# 生产环境
wrangler kv:namespace create "BTC_KV"

# 预览环境
wrangler kv:namespace create "BTC_KV" --preview
```

4. **更新 wrangler.toml**
将返回的 KV ID 填入配置文件：
```toml
[[env.production.kv_namespaces]]
binding = "BTC_KV"
id = "your-production-kv-id"
preview_id = "your-preview-kv-id"
```

5. **部署**
```bash
wrangler deploy --env production
```

## 🔧 GitHub 自动部署

### 设置 GitHub Secrets

1. 在 GitHub 仓库设置中添加 Secret：
   - Name: `CLOUDFLARE_API_TOKEN`
   - Value: 您的 Cloudflare API Token

2. 获取 API Token：
   - 访问 [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
   - 点击 "Create Token"
   - 使用 "Custom token" 模板
   - 权限设置：
     - Zone: Zone:Read, Zone:Edit
     - Account: Cloudflare Workers:Edit

### 自动部署流程

推送代码到 main/master 分支后，GitHub Actions 会自动：
1. 安装依赖
2. 部署到 Cloudflare Workers
3. 更新全球 CDN

## 📊 功能验证

部署完成后，访问您的 Worker URL，应该能看到：

1. **价格显示**: 当前比特币价格（美元和人民币）
2. **数据源**: 显示价格来源（CoinGecko/CoinDesk/Binance）
3. **更新时间**: 最后更新时间
4. **趋势图**: 最近24小时价格变化
5. **手动刷新**: 点击刷新按钮获取最新价格

## 🔍 监控和维护

### 查看实时日志
```bash
wrangler tail --env production
```

### 查看存储数据
```bash
# 查看当前价格
wrangler kv:key get "btc_current_price" --binding BTC_KV --env production

# 查看历史数据
wrangler kv:key get "btc_historical" --binding BTC_KV --env production

# 列出所有键
wrangler kv:key list --binding BTC_KV --env production
```

### 手动触发定时任务
```bash
# 通过 API 手动刷新
curl -X POST https://your-worker-url.workers.dev/api/refresh
```

## ⚙️ 自定义配置

### 修改更新频率

在 `wrangler.toml` 中修改 cron 表达式：

```toml
[env.production.triggers]
crons = ["0 * * * *"]      # 每小时
# crons = ["*/30 * * * *"]  # 每30分钟
# crons = ["0 */6 * * *"]   # 每6小时
# crons = ["0 0 * * *"]     # 每天午夜
```

### 添加更多价格源

在 `src/index.js` 的 `fetchBitcoinPrice` 函数中添加新的 API：

```javascript
const apis = [
    'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,cny',
    'https://api.coindesk.com/v1/bpi/currentprice.json',
    'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT',
    // 添加新的 API
    'https://your-new-api.com/bitcoin/price'
];
```

### 自定义域名

1. 在 Cloudflare Dashboard 中添加域名
2. 在 `wrangler.toml` 中配置路由：

```toml
[env.production]
routes = [
  { pattern = "btc.yourdomain.com/*", zone_name = "yourdomain.com" }
]
```

## 💰 成本分析

### Cloudflare Workers 免费额度
- **请求数**: 每天 100,000 次
- **CPU 时间**: 每次请求最多 10ms
- **KV 操作**: 每天 100,000 次读取，1,000 次写入

### 预估使用量
- **定时任务**: 每天 24 次写入
- **用户访问**: 假设每天 1,000 次页面访问
- **API 调用**: 假设每天 500 次 API 请求

**结论**: 免费额度完全够用，无需付费。

## 🚨 故障排除

### 常见问题

1. **定时任务不执行**
   - 检查 cron 表达式格式
   - 确认 Worker 部署成功
   - 查看 Cloudflare Dashboard 中的 Cron Triggers

2. **无法获取价格**
   - 检查 API 源是否可访问
   - 查看 Worker 日志
   - 尝试手动刷新

3. **KV 数据问题**
   - 确认 KV 绑定配置正确
   - 检查数据格式
   - 验证权限设置

### 调试命令

```bash
# 查看 Worker 状态
wrangler status --env production

# 查看部署历史
wrangler deployments list --env production

# 测试本地开发
wrangler dev
```

## 📞 技术支持

如果遇到问题，可以：

1. 查看 [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
2. 检查 [GitHub Issues](https://github.com/your-repo/issues)
3. 查看项目 README.md 文件

---

🎉 **恭喜！您的比特币价格追踪器现在已经在全球 Cloudflare 网络上运行了！**