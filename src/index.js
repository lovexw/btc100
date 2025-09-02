// Cloudflare Worker for Bitcoin Price Tracker
// 支持定时获取价格并存储到KV，同时提供Web界面

const HTML_CONTENT = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>比特币价格追踪器 - Cloudflare版</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        header {
            text-align: center;
            margin-bottom: 30px;
            color: white;
        }

        header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        header h1 i {
            color: #f7931a;
            margin-right: 15px;
        }

        .subtitle {
            font-size: 1.1rem;
            opacity: 0.9;
        }

        .price-card, .chart-card, .status-card {
            background: white;
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }

        .price-card:hover, .chart-card:hover, .status-card:hover {
            transform: translateY(-5px);
        }

        .price-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .price-header h2 {
            color: #333;
            font-size: 1.5rem;
        }

        .refresh-btn {
            background: #f7931a;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.3s ease;
        }

        .refresh-btn:hover {
            background: #e8851d;
            transform: scale(1.05);
        }

        .refresh-btn:active {
            transform: scale(0.95);
        }

        .refresh-btn.loading {
            opacity: 0.7;
            pointer-events: none;
        }

        .refresh-btn.loading::after {
            content: '';
            display: inline-block;
            width: 12px;
            height: 12px;
            border: 2px solid #fff;
            border-top: 2px solid transparent;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-left: 8px;
        }

        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        .price-display {
            text-align: center;
            margin: 30px 0;
        }

        .price-main {
            font-size: 3.5rem;
            font-weight: bold;
            color: #f7931a;
            margin-bottom: 10px;
        }

        .currency {
            font-size: 2.5rem;
            opacity: 0.8;
        }

        .price-cny {
            font-size: 1.5rem;
            color: #666;
            font-weight: 500;
        }

        .price-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 25px;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }

        .info-item {
            display: flex;
            flex-direction: column;
            text-align: center;
        }

        .label {
            font-size: 0.9rem;
            color: #888;
            margin-bottom: 5px;
        }

        .info-item span:last-child {
            font-weight: 600;
            color: #333;
        }

        .chart-card h3, .status-card h3 {
            color: #333;
            margin-bottom: 20px;
            font-size: 1.3rem;
        }

        .chart-container {
            position: relative;
            height: 300px;
            background: #f8f9fa;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .status-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
        }

        .status-item {
            display: flex;
            align-items: center;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 10px;
            transition: background 0.3s ease;
        }

        .status-item:hover {
            background: #e9ecef;
        }

        .status-item i {
            color: #f7931a;
            margin-right: 15px;
            font-size: 1.2rem;
            width: 20px;
        }

        .error-message {
            background: #f8d7da;
            color: #721c24;
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
            border: 1px solid #f5c6cb;
        }

        .success-message {
            background: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
            border: 1px solid #c3e6cb;
        }

        .cloudflare-badge {
            background: linear-gradient(135deg, #f38020 0%, #f5af19 100%);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: bold;
            display: inline-block;
            margin-top: 10px;
        }

        @media (max-width: 768px) {
            .container {
                padding: 15px;
            }
            
            header h1 {
                font-size: 2rem;
            }
            
            .price-main {
                font-size: 2.5rem;
            }
            
            .price-info {
                grid-template-columns: 1fr;
            }
            
            .price-header {
                flex-direction: column;
                gap: 15px;
            }
            
            .status-info {
                grid-template-columns: 1fr;
            }
        }
    </style>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body>
    <div class="container">
        <header>
            <h1><i class="fab fa-bitcoin"></i> 比特币价格追踪器</h1>
            <p class="subtitle">基于 Cloudflare Workers + KV 存储</p>
            <div class="cloudflare-badge">
                <i class="fas fa-cloud"></i> Powered by Cloudflare
            </div>
        </header>

        <div class="price-card">
            <div class="price-header">
                <h2>当前价格</h2>
                <button id="refreshBtn" class="refresh-btn">
                    <i class="fas fa-sync-alt"></i> 刷新
                </button>
            </div>
            
            <div class="price-display">
                <div class="price-main">
                    <span class="currency">$</span>
                    <span id="currentPrice">加载中...</span>
                </div>
                <div class="price-cny">
                    ≈ ¥<span id="currentPriceCNY">-</span>
                </div>
            </div>
            
            <div class="price-info">
                <div class="info-item">
                    <span class="label">数据源:</span>
                    <span id="dataSource">-</span>
                </div>
                <div class="info-item">
                    <span class="label">更新时间:</span>
                    <span id="updateTime">-</span>
                </div>
            </div>
        </div>

        <div class="chart-card">
            <h3>价格趋势 (最近24小时)</h3>
            <div class="chart-container">
                <canvas id="priceChart" width="800" height="300"></canvas>
            </div>
        </div>

        <div class="status-card">
            <h3>服务状态</h3>
            <div class="status-info">
                <div class="status-item">
                    <i class="fas fa-clock"></i>
                    <span>自动更新: 每小时一次</span>
                </div>
                <div class="status-item">
                    <i class="fas fa-database"></i>
                    <span>数据存储: Cloudflare KV</span>
                </div>
                <div class="status-item">
                    <i class="fas fa-globe"></i>
                    <span>全球CDN: 快速访问</span>
                </div>
                <div class="status-item">
                    <i class="fas fa-shield-alt"></i>
                    <span>安全防护: Cloudflare</span>
                </div>
            </div>
        </div>
    </div>

    <script>
        class BitcoinTracker {
            constructor() {
                this.currentPrice = null;
                this.historicalData = [];
                this.init();
            }

            async init() {
                await this.loadCurrentPrice();
                await this.loadHistoricalData();
                this.setupEventListeners();
                this.startAutoRefresh();
                this.drawChart();
            }

            async loadCurrentPrice() {
                try {
                    const response = await fetch('/api/price');
                    const result = await response.json();
                    
                    if (result.success) {
                        this.currentPrice = result.data;
                        this.updatePriceDisplay();
                    } else {
                        this.showError('暂无价格数据');
                    }
                } catch (error) {
                    console.error('获取价格失败:', error);
                    this.showError('获取价格失败，请检查网络连接');
                }
            }

            async loadHistoricalData() {
                try {
                    const response = await fetch('/api/history');
                    const result = await response.json();
                    
                    if (result.success) {
                        this.historicalData = result.data;
                        this.drawChart();
                    }
                } catch (error) {
                    console.error('获取历史数据失败:', error);
                }
            }

            updatePriceDisplay() {
                if (!this.currentPrice) return;

                document.getElementById('currentPrice').textContent = 
                    this.formatNumber(this.currentPrice.price);
                document.getElementById('currentPriceCNY').textContent = 
                    this.formatNumber(this.currentPrice.cny_estimate);
                document.getElementById('dataSource').textContent = 
                    this.currentPrice.source || '未知';
                document.getElementById('updateTime').textContent = 
                    this.formatTime(this.currentPrice.timestamp);
            }

            formatNumber(num) {
                return new Intl.NumberFormat('zh-CN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }).format(num);
            }

            formatTime(timestamp) {
                const date = new Date(timestamp);
                return date.toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }

            async refreshPrice() {
                const refreshBtn = document.getElementById('refreshBtn');
                const originalText = refreshBtn.innerHTML;
                
                refreshBtn.classList.add('loading');
                refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> 刷新中...';
                
                try {
                    const response = await fetch('/api/refresh', {
                        method: 'POST'
                    });
                    const result = await response.json();
                    
                    if (result.success) {
                        this.currentPrice = result.data;
                        this.updatePriceDisplay();
                        await this.loadHistoricalData();
                        this.showSuccess('价格更新成功！');
                    } else {
                        this.showError('刷新失败: ' + result.message);
                    }
                } catch (error) {
                    console.error('刷新价格失败:', error);
                    this.showError('刷新失败，请稍后重试');
                } finally {
                    refreshBtn.classList.remove('loading');
                    refreshBtn.innerHTML = originalText;
                }
            }

            drawChart() {
                const canvas = document.getElementById('priceChart');
                const ctx = canvas.getContext('2d');
                
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                if (!this.historicalData || this.historicalData.length === 0) {
                    ctx.fillStyle = '#666';
                    ctx.font = '16px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('暂无历史数据', canvas.width / 2, canvas.height / 2);
                    return;
                }

                const data = this.historicalData.map(item => item.price);
                const labels = this.historicalData.map(item => new Date(item.timestamp));
                
                const padding = 40;
                const chartWidth = canvas.width - 2 * padding;
                const chartHeight = canvas.height - 2 * padding;
                
                const minPrice = Math.min(...data);
                const maxPrice = Math.max(...data);
                const priceRange = maxPrice - minPrice;
                
                // 绘制网格线
                ctx.strokeStyle = '#e0e0e0';
                ctx.lineWidth = 1;
                
                for (let i = 0; i <= 6; i++) {
                    const x = padding + (chartWidth / 6) * i;
                    ctx.beginPath();
                    ctx.moveTo(x, padding);
                    ctx.lineTo(x, padding + chartHeight);
                    ctx.stroke();
                }
                
                for (let i = 0; i <= 4; i++) {
                    const y = padding + (chartHeight / 4) * i;
                    ctx.beginPath();
                    ctx.moveTo(padding, y);
                    ctx.lineTo(padding + chartWidth, y);
                    ctx.stroke();
                }
                
                // 绘制价格线
                if (data.length > 1) {
                    ctx.strokeStyle = '#f7931a';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    
                    for (let i = 0; i < data.length; i++) {
                        const x = padding + (chartWidth / (data.length - 1)) * i;
                        const y = padding + chartHeight - ((data[i] - minPrice) / priceRange) * chartHeight;
                        
                        if (i === 0) {
                            ctx.moveTo(x, y);
                        } else {
                            ctx.lineTo(x, y);
                        }
                    }
                    
                    ctx.stroke();
                    
                    // 绘制数据点
                    ctx.fillStyle = '#f7931a';
                    for (let i = 0; i < data.length; i++) {
                        const x = padding + (chartWidth / (data.length - 1)) * i;
                        const y = padding + chartHeight - ((data[i] - minPrice) / priceRange) * chartHeight;
                        
                        ctx.beginPath();
                        ctx.arc(x, y, 4, 0, 2 * Math.PI);
                        ctx.fill();
                    }
                }
                
                // Y轴标签
                ctx.fillStyle = '#666';
                ctx.font = '12px Arial';
                ctx.textAlign = 'right';
                
                for (let i = 0; i <= 4; i++) {
                    const price = minPrice + (priceRange / 4) * (4 - i);
                    const y = padding + (chartHeight / 4) * i;
                    ctx.fillText('$' + this.formatNumber(price), padding - 10, y + 4);
                }
                
                // X轴标签
                ctx.textAlign = 'center';
                if (labels.length > 0) {
                    const step = Math.max(1, Math.floor(labels.length / 6));
                    for (let i = 0; i < labels.length; i += step) {
                        const x = padding + (chartWidth / (data.length - 1)) * i;
                        const timeStr = labels[i].toLocaleTimeString('zh-CN', {
                            hour: '2-digit',
                            minute: '2-digit'
                        });
                        ctx.fillText(timeStr, x, padding + chartHeight + 20);
                    }
                }
            }

            setupEventListeners() {
                document.getElementById('refreshBtn').addEventListener('click', () => {
                    this.refreshPrice();
                });
            }

            startAutoRefresh() {
                setInterval(() => {
                    this.loadCurrentPrice();
                }, 5 * 60 * 1000);
            }

            showError(message) {
                this.showMessage(message, 'error');
            }

            showSuccess(message) {
                this.showMessage(message, 'success');
            }

            showMessage(message, type) {
                const existingMessage = document.querySelector('.error-message, .success-message');
                if (existingMessage) {
                    existingMessage.remove();
                }

                const messageDiv = document.createElement('div');
                messageDiv.className = type === 'error' ? 'error-message' : 'success-message';
                messageDiv.textContent = message;

                const priceCard = document.querySelector('.price-card');
                priceCard.parentNode.insertBefore(messageDiv, priceCard.nextSibling);

                setTimeout(() => {
                    messageDiv.remove();
                }, 3000);
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            new BitcoinTracker();
        });
    </script>
</body>
</html>
`;

// 比特币价格获取函数
async function fetchBitcoinPrice() {
    const apis = [
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,cny',
        'https://api.coindesk.com/v1/bpi/currentprice.json',
        'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT'
    ];

    for (const api of apis) {
        try {
            console.log(`尝试从 ${api} 获取价格...`);
            const response = await fetch(api, { 
                timeout: 10000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; BTC-Price-Tracker/1.0)'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            let price = null;
            let source = '';
            
            if (api.includes('coingecko')) {
                price = data.bitcoin.usd;
                source = 'CoinGecko';
            } else if (api.includes('coindesk')) {
                price = parseFloat(data.bpi.USD.rate.replace(',', ''));
                source = 'CoinDesk';
            } else if (api.includes('binance')) {
                price = parseFloat(data.price);
                source = 'Binance';
            }
            
            if (price) {
                const priceData = {
                    price: price,
                    timestamp: new Date().toISOString(),
                    source: source,
                    cny_estimate: Math.round(price * 7.2) // 简单汇率估算
                };
                
                console.log(`✅ 成功获取比特币价格: $${price} (来源: ${source})`);
                return priceData;
            }
        } catch (error) {
            console.log(`❌ 从 ${api} 获取价格失败:`, error.message);
            continue;
        }
    }
    
    console.error('所有API都无法访问，获取价格失败');
    return null;
}

// 保存历史数据
async function saveHistoricalData(env, priceData) {
    try {
        const historicalKey = 'btc_historical';
        const existingData = await env.BTC_KV.get(historicalKey, 'json') || [];
        
        existingData.push(priceData);
        
        // 只保留最近100条记录
        if (existingData.length > 100) {
            existingData.splice(0, existingData.length - 100);
        }
        
        await env.BTC_KV.put(historicalKey, JSON.stringify(existingData));
        console.log('历史数据保存成功');
    } catch (error) {
        console.error('保存历史数据失败:', error);
    }
}

// 定时任务处理函数
async function handleScheduled(env) {
    console.log('⏰ 定时任务开始执行...');
    
    const priceData = await fetchBitcoinPrice();
    if (priceData) {
        // 保存当前价格
        await env.BTC_KV.put('btc_current_price', JSON.stringify(priceData));
        
        // 保存历史数据
        await saveHistoricalData(env, priceData);
        
        console.log('✅ 定时任务执行完成');
    } else {
        console.error('❌ 定时任务执行失败');
    }
}

// 主要的请求处理函数
export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const path = url.pathname;

        // 处理API请求
        if (path.startsWith('/api/')) {
            const corsHeaders = {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            };

            // 处理预检请求
            if (request.method === 'OPTIONS') {
                return new Response(null, { headers: corsHeaders });
            }

            try {
                if (path === '/api/price') {
                    // 获取当前价格
                    const currentPrice = await env.BTC_KV.get('btc_current_price', 'json');
                    if (currentPrice) {
                        return new Response(JSON.stringify({
                            success: true,
                            data: currentPrice
                        }), {
                            headers: { 
                                'Content-Type': 'application/json',
                                ...corsHeaders
                            }
                        });
                    } else {
                        return new Response(JSON.stringify({
                            success: false,
                            message: '暂无价格数据'
                        }), {
                            status: 404,
                            headers: { 
                                'Content-Type': 'application/json',
                                ...corsHeaders
                            }
                        });
                    }
                }

                if (path === '/api/history') {
                    // 获取历史数据
                    const historical = await env.BTC_KV.get('btc_historical', 'json') || [];
                    const recentData = historical.slice(-24); // 最近24条记录
                    
                    return new Response(JSON.stringify({
                        success: true,
                        data: recentData
                    }), {
                        headers: { 
                            'Content-Type': 'application/json',
                            ...corsHeaders
                        }
                    });
                }

                if (path === '/api/refresh' && request.method === 'POST') {
                    // 手动刷新价格
                    console.log('手动刷新价格请求...');
                    const priceData = await fetchBitcoinPrice();
                    if (priceData) {
                        await env.BTC_KV.put('btc_current_price', JSON.stringify(priceData));
                        await saveHistoricalData(env, priceData);
                        
                        return new Response(JSON.stringify({
                            success: true,
                            data: priceData
                        }), {
                            headers: { 
                                'Content-Type': 'application/json',
                                ...corsHeaders
                            }
                        });
                    } else {
                        return new Response(JSON.stringify({
                            success: false,
                            message: '获取价格失败'
                        }), {
                            status: 500,
                            headers: { 
                                'Content-Type': 'application/json',
                                ...corsHeaders
                            }
                        });
                    }
                }

                // API路径不存在
                return new Response(JSON.stringify({
                    success: false,
                    message: 'API路径不存在'
                }), {
                    status: 404,
                    headers: { 
                        'Content-Type': 'application/json',
                        ...corsHeaders
                    }
                });

            } catch (error) {
                console.error('API处理错误:', error);
                return new Response(JSON.stringify({
                    success: false,
                    message: '服务器内部错误'
                }), {
                    status: 500,
                    headers: { 
                        'Content-Type': 'application/json',
                        ...corsHeaders
                    }
                });
            }
        }

        // 返回HTML页面
        return new Response(HTML_CONTENT, {
            headers: {
                'Content-Type': 'text/html;charset=UTF-8',
                'Cache-Control': 'public, max-age=300' // 缓存5分钟
            }
        });
    },

    // 定时任务处理
    async scheduled(controller, env, ctx) {
        ctx.waitUntil(handleScheduled(env));
    }
};