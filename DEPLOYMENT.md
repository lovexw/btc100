# Cloudflare 部署指南

## 快速部署步骤

### 1. 准备工作

确保您有 Cloudflare 账户，并安装了 Node.js。

### 2. 安装依赖

```bash
npm install -g wrangler
```

### 3. 登录 Cloudflare

```bash
wrangler login
```

### 4. 创建 KV 存储

```bash
# 创建生产环境 KV 命名空间
wrangler kv:namespace create "BTC_KV"

# 创建预览环境 KV 命名空间
wrangler kv:namespace create "BTC_KV" --preview
```

命令执行后会返回类似这样的信息：
```
🌀 Creating namespace with title "btc-price-tracker-BTC_KV"
✨ Success!
Add the following to your configuration file in your kv_namespaces array:
{ binding = "BTC_KV", id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" }
```

### 5. 更新配置文件

将获得的 KV 命名空间 ID 更新到 `wrangler.toml` 文件中：

```toml
[env.production]
name = "btc-price-tracker"
main = "src/index.js"
compatibility_date = "2024-01-01"

[[env.production.kv_namespaces]]
binding = "BTC_KV"
id = "你的生产环境KV_ID"           # 替换这里
preview_id = "你的预览环境KV_ID"    # 替换这里

[env.production.triggers]
crons = ["0 * * * *"]  # 每小时执行一次
```

### 6. 部署到 Cloudflare

```bash
# 部署到生产环境
wrangler deploy --env production
```

部署成功后，您会看到类似的输出：
```
✨ Success! Uploaded 1 files (x.xx sec)
✨ Deployment complete! Take a flight over to https://btc-price-tracker.your-subdomain.workers.dev to see your worker in action.
```

### 7. 验证部署

访问提供的 URL，您应该能看到比特币价格追踪器页面。

## 高级配置

### 自定义域名

1. 在 Cloudflare Dashboard 中添加自定义域名
2. 在 `wrangler.toml` 中添加路由配置：

```toml
[env.production]
routes = [
  { pattern = "btc.yourdomain.com/*", zone_name = "yourdomain.com" }
]
```

### 环境变量

如果需要添加环境变量（如API密钥），可以使用：

```bash
wrangler secret put API_KEY --env production
```

### 监控和日志

查看实时日志：
```bash
wrangler tail --env production
```

## 常见问题

### Q: 定时任务不执行怎么办？
A: 检查 Cloudflare Dashboard 中的 Cron Triggers 是否已启用。

### Q: 如何更新代码？
A: 修改代码后重新运行 `wrangler deploy --env production`。

### Q: 如何查看存储的数据？
A: 使用 `wrangler kv:key list --binding BTC_KV --env production` 查看所有键。

### Q: 如何删除 KV 中的数据？
A: 使用 `wrangler kv:key delete "key_name" --binding BTC_KV --env production`。

## 成本说明

Cloudflare Workers 免费计划包括：
- 每天 100,000 次请求
- 每次执行最多 10ms CPU 时间
- KV 存储：100,000 次读取，1,000 次写入/删除

对于这个比特币价格追踪器，免费额度完全够用。