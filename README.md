# 比特币价格追踪器 - Cloudflare 版

基于 Cloudflare Workers 和 KV 存储的比特币价格追踪系统，专为中国大陆网络环境优化，支持自动定时获取价格并永久存储。

## 🚀 功能特点

- ⚡ **Cloudflare Workers**: 全球边缘计算，访问速度快
- 💾 **KV 永久存储**: 数据持久化存储，不会丢失
- 🕐 **定时自动更新**: 每小时自动获取最新价格
- 🌐 **多API备份**: 支持多个价格源，提高成功率
- 📊 **价格趋势图**: 显示最近24小时价格变化
- 🔄 **手动刷新**: 支持手动获取最新价格
- 📱 **响应式设计**: 完美适配各种设备
- 🇨🇳 **中文界面**: 完全中文化用户体验

## 🛠️ 技术栈

- **Cloudflare Workers**: 边缘计算平台
- **Cloudflare KV**: 键值存储数据库
- **Cron Triggers**: 定时任务触发器
- **原生 Web 技术**: HTML/CSS/JavaScript

## 📦 部署步骤

### 1. 安装 Wrangler CLI

```bash
npm install -g wrangler
```

### 2. 登录 Cloudflare

```bash
wrangler login
```

### 3. 创建 KV 命名空间

```bash
# 创建生产环境 KV 命名空间
npm run kv:create

# 创建预览环境 KV 命名空间  
npm run kv:create:preview
```

### 4. 配置 wrangler.toml

将创建的 KV 命名空间 ID 填入 `wrangler.toml` 文件中：

```toml
[[env.production.kv_namespaces]]
binding = "BTC_KV"
id = "your-kv-namespace-id"        # 替换为实际的 KV ID
preview_id = "your-preview-kv-id"  # 替换为实际的预览 KV ID
```

### 5. 部署到 Cloudflare

```bash
# 部署到生产环境
npm run deploy

# 或部署到开发环境
npm run deploy:dev
```

### 6. 设置定时任务

部署完成后，Cloudflare 会自动设置定时任务（每小时执行一次）。

## 🔧 本地开发

```bash
# 本地开发模式
npm run dev
```

## 📊 API 接口

### 获取当前价格
```
GET /api/price
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "price": 45000.50,
    "timestamp": "2024-01-01T12:00:00.000Z",
    "source": "CoinGecko",
    "cny_estimate": 324000
  }
}
```

### 获取历史数据
```
GET /api/history
```

**响应示例:**
```json
{
  "success": true,
  "data": [
    {
      "price": 45000.50,
      "timestamp": "2024-01-01T12:00:00.000Z",
      "source": "CoinGecko",
      "cny_estimate": 324000
    }
  ]
}
```

### 手动刷新价格
```
POST /api/refresh
```

## ⚙️ 配置说明

### 定时任务频率

在 `wrangler.toml` 中修改 cron 表达式：

```toml
[env.production.triggers]
crons = ["0 * * * *"]  # 每小时执行一次
# crons = ["*/30 * * * *"]  # 每30分钟执行一次
# crons = ["0 */6 * * *"]   # 每6小时执行一次
```

### 价格数据源

系统按优先级尝试以下API：
1. CoinGecko API (推荐)
2. CoinDesk API
3. Binance API

### 数据存储

- **当前价格**: 存储在 `btc_current_price` 键
- **历史数据**: 存储在 `btc_historical` 键
- **数据保留**: 最多保留100条历史记录

## 🌍 部署优势

### Cloudflare Workers 优势
- ✅ 全球 CDN 加速
- ✅ 边缘计算，响应快速
- ✅ 自动扩容，无需运维
- ✅ 免费额度充足

### KV 存储优势
- ✅ 数据永久存储
- ✅ 全球同步
- ✅ 高可用性
- ✅ 简单易用

## 🔍 监控和调试

### 查看实时日志
```bash
npm run tail
```

### 查看 KV 数据
```bash
# 查看当前价格
wrangler kv:key get "btc_current_price" --binding BTC_KV

# 查看历史数据
wrangler kv:key get "btc_historical" --binding BTC_KV
```

## 🚨 故障排除

### 1. 定时任务不执行
- 检查 `wrangler.toml` 中的 cron 配置
- 确认 Worker 已正确部署
- 查看 Cloudflare Dashboard 中的 Cron Triggers

### 2. 无法获取价格
- 检查 API 源是否可访问
- 查看 Worker 日志了解具体错误
- 尝试手动刷新功能

### 3. KV 数据问题
- 确认 KV 命名空间 ID 配置正确
- 检查 KV 绑定是否生效
- 验证数据格式是否正确

## 📝 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**注意**: 这是一个教育和演示项目，不构成投资建议。加密货币投资有风险，请谨慎决策。