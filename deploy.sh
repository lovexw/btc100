#!/bin/bash

echo "🚀 开始部署比特币价格追踪器到 Cloudflare..."

# 检查是否安装了 wrangler
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI 未安装，正在安装..."
    npm install -g wrangler
fi

# 检查是否已登录
echo "🔐 检查 Cloudflare 登录状态..."
if ! wrangler whoami &> /dev/null; then
    echo "请先登录 Cloudflare:"
    wrangler login
fi

# 创建 KV 命名空间（如果不存在）
echo "📦 创建 KV 存储命名空间..."
echo "请手动执行以下命令并更新 wrangler.toml 文件："
echo ""
echo "wrangler kv:namespace create \"BTC_KV\""
echo "wrangler kv:namespace create \"BTC_KV\" --preview"
echo ""
echo "然后将返回的 ID 更新到 wrangler.toml 文件中"
echo ""

read -p "是否已完成 KV 命名空间配置？(y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "请先完成 KV 配置后再运行部署"
    exit 1
fi

# 部署到生产环境
echo "🌐 部署到 Cloudflare Workers..."
wrangler deploy --env production

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 部署成功！"
    echo ""
    echo "🎉 您的比特币价格追踪器已成功部署到 Cloudflare！"
    echo ""
    echo "📊 功能特性："
    echo "  - 每小时自动获取比特币价格"
    echo "  - 数据永久存储在 Cloudflare KV"
    echo "  - 全球 CDN 加速访问"
    echo "  - 支持手动刷新价格"
    echo "  - 显示价格趋势图表"
    echo ""
    echo "🔧 管理命令："
    echo "  查看日志: wrangler tail --env production"
    echo "  查看数据: wrangler kv:key get \"btc_current_price\" --binding BTC_KV --env production"
    echo ""
else
    echo "❌ 部署失败，请检查配置和网络连接"
    exit 1
fi