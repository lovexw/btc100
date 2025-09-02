const express = require('express');
const cron = require('node-cron');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 简单的KV存储（使用JSON文件模拟）
const KV_FILE = path.join(__dirname, 'btc_data.json');

// 初始化KV存储
async function initKV() {
    try {
        await fs.access(KV_FILE);
    } catch {
        await fs.writeFile(KV_FILE, JSON.stringify({}));
    }
}

// 读取KV数据
async function getKV(key) {
    try {
        const data = await fs.readFile(KV_FILE, 'utf8');
        const kv = JSON.parse(data);
        return kv[key];
    } catch (error) {
        console.error('读取KV数据失败:', error);
        return null;
    }
}

// 写入KV数据
async function setKV(key, value) {
    try {
        const data = await fs.readFile(KV_FILE, 'utf8');
        const kv = JSON.parse(data);
        kv[key] = value;
        await fs.writeFile(KV_FILE, JSON.stringify(kv, null, 2));
        return true;
    } catch (error) {
        console.error('写入KV数据失败:', error);
        return false;
    }
}

// 获取比特币价格的函数
async function fetchBitcoinPrice() {
    const apis = [
        'https://api.coindesk.com/v1/bpi/currentprice.json',
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,cny',
        'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT'
    ];

    for (const api of apis) {
        try {
            console.log(`尝试从 ${api} 获取价格...`);
            const response = await axios.get(api, { timeout: 10000 });
            
            let price = null;
            let source = '';
            
            if (api.includes('coindesk')) {
                price = parseFloat(response.data.bpi.USD.rate.replace(',', ''));
                source = 'CoinDesk';
            } else if (api.includes('coingecko')) {
                price = response.data.bitcoin.usd;
                source = 'CoinGecko';
            } else if (api.includes('binance')) {
                price = parseFloat(response.data.price);
                source = 'Binance';
            }
            
            if (price) {
                const priceData = {
                    price: price,
                    timestamp: new Date().toISOString(),
                    source: source,
                    cny_estimate: Math.round(price * 7.2) // 简单汇率估算
                };
                
                await setKV('btc_current_price', priceData);
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

// 获取历史价格数据
async function getHistoricalData() {
    const historical = await getKV('btc_historical') || [];
    return historical.slice(-24); // 返回最近24条记录
}

// 保存历史数据
async function saveHistoricalData(priceData) {
    const historical = await getKV('btc_historical') || [];
    historical.push(priceData);
    
    // 只保留最近100条记录
    if (historical.length > 100) {
        historical.splice(0, historical.length - 100);
    }
    
    await setKV('btc_historical', historical);
}

// API路由
app.get('/api/price', async (req, res) => {
    const currentPrice = await getKV('btc_current_price');
    if (currentPrice) {
        res.json({
            success: true,
            data: currentPrice
        });
    } else {
        res.status(404).json({
            success: false,
            message: '暂无价格数据'
        });
    }
});

app.get('/api/history', async (req, res) => {
    const historical = await getHistoricalData();
    res.json({
        success: true,
        data: historical
    });
});

// 手动刷新价格
app.post('/api/refresh', async (req, res) => {
    console.log('手动刷新价格请求...');
    const priceData = await fetchBitcoinPrice();
    if (priceData) {
        await saveHistoricalData(priceData);
        res.json({
            success: true,
            data: priceData
        });
    } else {
        res.status(500).json({
            success: false,
            message: '获取价格失败'
        });
    }
});

// 定时任务：每小时获取一次价格
cron.schedule('0 * * * *', async () => {
    console.log('⏰ 定时获取比特币价格...');
    const priceData = await fetchBitcoinPrice();
    if (priceData) {
        await saveHistoricalData(priceData);
    }
});

// 启动时立即获取一次价格
async function startup() {
    await initKV();
    console.log('🚀 服务启动，立即获取比特币价格...');
    const priceData = await fetchBitcoinPrice();
    if (priceData) {
        await saveHistoricalData(priceData);
    }
}

app.listen(PORT, () => {
    console.log(`🌟 比特币价格追踪服务运行在 http://localhost:${PORT}`);
    startup();
});