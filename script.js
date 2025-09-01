class BitcoinPriceTracker {
    constructor() {
        this.currentPrice = 0; // 将从API获取
        this.targetPrice = 1000000; // 100万美元
        this.targetDate = new Date('2033-12-31T23:59:59');
        this.startTime = new Date();
        this.pricePerSecond = 0;
        this.timer = null;
        this.chart = null;
        this.chartData = [];
        
        this.init();
    }

    async init() {
        await this.fetchCurrentPrice(); // 先获取实时价格
        this.calculateGrowthRate();
        this.initChart();
        this.startPredictionTimer();
        this.updateTimeRemaining();
        
        // 每5分钟更新一次实时价格
        setInterval(() => {
            this.fetchCurrentPrice();
        }, 5 * 60 * 1000);
    }

    async fetchCurrentPrice() {
        try {
            // 使用CoinGecko免费API获取比特币价格
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
            const data = await response.json();
            
            if (data.bitcoin && data.bitcoin.usd) {
                this.currentPrice = data.bitcoin.usd;
                console.log(`比特币当前价格: $${this.currentPrice}`);
                
                // 重新计算增长率（如果价格有变化）
                this.calculateGrowthRate();
                
                // 重新生成图表数据
                this.generateChartData();
            }
            
        } catch (error) {
            console.error('获取比特币价格失败:', error);
            // 如果API失败，使用默认价格
            if (this.currentPrice === 0) {
                this.currentPrice = 108000; // 备用价格
                console.log('使用备用价格: $108,000');
            }
        }
    }

    initChart() {
        const canvas = document.getElementById('priceChart');
        const ctx = canvas.getContext('2d');
        
        // 设置canvas尺寸
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * 2; // 高DPI支持
        canvas.height = rect.height * 2;
        ctx.scale(2, 2);
        
        this.chart = {
            canvas: canvas,
            ctx: ctx,
            width: rect.width,
            height: rect.height,
            padding: { top: 20, right: 50, bottom: 40, left: 80 }
        };
        
        this.generateChartData();
        this.drawChart();
        
        // 每秒更新图表
        setInterval(() => {
            this.drawChart();
        }, 1000);
    }

    generateChartData() {
        this.chartData = [];
        
        // 创建从2015年到2033年的均匀时间轴
        const startYear = 2015;
        const endYear = 2033;
        const totalYears = endYear - startYear + 1; // 19年

        // 历史比特币价格高点数据
        const historicalPrices = {
            2015: 460,
            2016: 980,
            2017: 19783,
            2018: 17527,
            2019: 13016,
            2020: 28949,
            2021: 68789,
            2022: 47686,
            2023: 44700,
            2024: 73750,
            2025: this.currentPrice || 108000 // 使用实时价格或备用价格
        };

        // 为每年创建均匀分布的数据点
        for (let year = startYear; year <= endYear; year++) {
            let price;
            let isHistorical = false;
            let isTarget = false;
            
            if (year <= 2025) {
                // 历史数据
                price = historicalPrices[year] || this.currentPrice;
                isHistorical = true;
            } else if (year === 2033) {
                // 目标年份
                price = this.targetPrice;
                isTarget = true;
            } else {
                // 未来预测数据 (2026-2032)
                const progress = (year - 2025) / (2033 - 2025);
                const basePrice = this.currentPrice + (this.targetPrice - this.currentPrice) * progress;
                
                // 添加一些波动性
                const volatility = Math.sin(progress * Math.PI * 2) * (this.targetPrice * 0.03);
                price = Math.max(this.currentPrice, basePrice + volatility);
            }
            
            this.chartData.push({
                year: year,
                price: price,
                isHistorical: isHistorical,
                isTarget: isTarget
            });
        }
    }

    drawChart() {
        const { ctx, width, height, padding } = this.chart;
        
        // 清空画布
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, width, height);
        
        // 计算绘图区域
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;
        
        // 价格范围
        const minPrice = Math.min(...this.chartData.map(d => d.price)) * 0.95;
        const maxPrice = this.targetPrice * 1.05;
        
        // 绘制网格线
        this.drawGrid(ctx, padding, chartWidth, chartHeight, minPrice, maxPrice);
        
        // 绘制价格线
        this.drawPriceLine(ctx, padding, chartWidth, chartHeight, minPrice, maxPrice);
        
        // 绘制关键点
        this.drawKeyPoints(ctx, padding, chartWidth, chartHeight, minPrice, maxPrice);
    }

    drawGrid(ctx, padding, chartWidth, chartHeight, minPrice, maxPrice) {
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 1;
        
        // 水平网格线 (价格)
        for (let i = 0; i <= 5; i++) {
            const y = padding.top + (chartHeight * i) / 5;
            const price = maxPrice - ((maxPrice - minPrice) * i) / 5;
            
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(padding.left + chartWidth, y);
            ctx.stroke();
            
            // 价格标签
            ctx.fillStyle = '#cccccc';
            ctx.font = '12px Arial';
            ctx.textAlign = 'right';
            ctx.fillText(`$${price.toLocaleString()}`, padding.left - 10, y + 4);
        }
        
        // 垂直网格线 (时间) - 每5年一条线
        const yearStep = 5;
        const startYear = 2015;
        const endYear = 2033;
        
        for (let year = startYear; year <= endYear; year += yearStep) {
            const yearOffset = year - startYear;
            const totalYears = endYear - startYear;
            const x = padding.left + (chartWidth * yearOffset) / totalYears;
            
            ctx.beginPath();
            ctx.moveTo(x, padding.top);
            ctx.lineTo(x, padding.top + chartHeight);
            ctx.stroke();
            
            // 年份标签
            ctx.fillStyle = '#cccccc';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(year.toString(), x, padding.top + chartHeight + 20);
        }
        
        // 添加2033年的网格线
        if (endYear % yearStep !== 0) {
            const yearOffset = endYear - startYear;
            const totalYears = endYear - startYear;
            const x = padding.left + (chartWidth * yearOffset) / totalYears;
            
            ctx.beginPath();
            ctx.moveTo(x, padding.top);
            ctx.lineTo(x, padding.top + chartHeight);
            ctx.stroke();
            
            ctx.fillStyle = '#cccccc';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('2033', x, padding.top + chartHeight + 20);
        }
    }

    drawPriceLine(ctx, padding, chartWidth, chartHeight, minPrice, maxPrice) {
        const startYear = 2015;
        const endYear = 2033;
        const totalYears = endYear - startYear;
        
        // 分别绘制历史数据和预测数据
        const historicalData = this.chartData.filter(p => p.isHistorical);
        const futureData = this.chartData.filter(p => !p.isHistorical);
        
        // 绘制历史价格线（实线）
        if (historicalData.length > 1) {
            ctx.strokeStyle = '#4CAF50';
            ctx.lineWidth = 3;
            ctx.setLineDash([]);
            
            ctx.beginPath();
            historicalData.forEach((point, index) => {
                const yearOffset = point.year - startYear;
                const x = padding.left + (chartWidth * yearOffset) / totalYears;
                const y = padding.top + chartHeight - ((point.price - minPrice) / (maxPrice - minPrice)) * chartHeight;
                
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            ctx.stroke();
        }
        
        // 绘制预测价格线（虚线）
        const futureDataWithCurrent = this.chartData.filter(p => p.year >= 2025);
        if (futureDataWithCurrent.length > 1) {
            ctx.strokeStyle = '#f7931a';
            ctx.lineWidth = 3;
            ctx.setLineDash([10, 5]);
            
            ctx.beginPath();
            futureDataWithCurrent.forEach((point, index) => {
                const yearOffset = point.year - startYear;
                const x = padding.left + (chartWidth * yearOffset) / totalYears;
                const y = padding.top + chartHeight - ((point.price - minPrice) / (maxPrice - minPrice)) * chartHeight;
                
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            ctx.stroke();
        }
        
        // 重置虚线设置
        ctx.setLineDash([]);
    }

    drawKeyPoints(ctx, padding, chartWidth, chartHeight, minPrice, maxPrice) {
        const startYear = 2015;
        const endYear = 2033;
        const totalYears = endYear - startYear;
        
        // 绘制历史高点 - 只显示价格，不显示年份
        const historicalData = this.chartData.filter(p => p.isHistorical && p.year !== 2025);
        historicalData.forEach((point, index) => {
            const yearOffset = point.year - startYear;
            const x = padding.left + (chartWidth * yearOffset) / totalYears;
            const y = padding.top + chartHeight - ((point.price - minPrice) / (maxPrice - minPrice)) * chartHeight;
            
            // 历史高点圆圈
            ctx.fillStyle = '#ff8c00';
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, 2 * Math.PI);
            ctx.fill();
            
            // 添加发光效果
            ctx.shadowColor = '#ff8c00';
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // 价格标签 - 避免重叠，交替显示位置
            ctx.fillStyle = '#ffffff';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            
            // 交替显示在上方和下方，避免重叠
            const labelY = (index % 2 === 0) ? y - 15 : y + 25;
            ctx.fillText(`$${point.price.toLocaleString()}`, x, labelY);
        });
        
        // 当前价格点 (2025)
        const currentYearOffset = 2025 - startYear;
        const currentX = padding.left + (chartWidth * currentYearOffset) / totalYears;
        const currentY = padding.top + chartHeight - ((this.currentPrice - minPrice) / (maxPrice - minPrice)) * chartHeight;
        
        ctx.fillStyle = '#f7931a';
        ctx.beginPath();
        ctx.arc(currentX, currentY, 10, 0, 2 * Math.PI);
        ctx.fill();
        
        // 添加强烈发光效果
        ctx.shadowColor = '#f7931a';
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // 当前价格标签 - 更大气
        ctx.fillStyle = '#f7931a';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeText('2025', currentX, currentY - 20);
        ctx.fillText('2025', currentX, currentY - 20);
        ctx.strokeText('当前', currentX, currentY + 30);
        ctx.fillText('当前', currentX, currentY + 30);
        
        // 目标价格点 (2033)
        const targetYearOffset = 2033 - startYear;
        const targetX = padding.left + (chartWidth * targetYearOffset) / totalYears;
        const targetY = padding.top + chartHeight - ((this.targetPrice - minPrice) / (maxPrice - minPrice)) * chartHeight;
        
        ctx.fillStyle = '#ff6b6b';
        ctx.beginPath();
        ctx.arc(targetX, targetY, 15, 0, 2 * Math.PI);
        ctx.fill();
        
        // 添加超强发光效果
        ctx.shadowColor = '#ff6b6b';
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // 目标标签 - 最大气
        ctx.fillStyle = '#ff6b6b';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.strokeText('2033', targetX, targetY - 25);
        ctx.fillText('2033', targetX, targetY - 25);
        ctx.strokeText('$1M', targetX, targetY + 35);
        ctx.fillText('$1M', targetX, targetY + 35);
    }

    calculateGrowthRate() {
        const now = new Date();
        const timeRemaining = this.targetDate - now; // 毫秒
        const secondsRemaining = timeRemaining / 1000;
        
        if (secondsRemaining > 0) {
            const priceGrowthNeeded = this.targetPrice - this.currentPrice;
            this.pricePerSecond = priceGrowthNeeded / secondsRemaining;
            
            // 更新统计信息
            this.updateStats(secondsRemaining);
        }
    }

    updateStats(secondsRemaining) {
        const daysRemaining = Math.floor(secondsRemaining / (24 * 60 * 60));
        
        document.getElementById('days-remaining').textContent = 
            `${daysRemaining.toLocaleString()} 天`;
        
        document.getElementById('per-second-growth').textContent = 
            `$${this.pricePerSecond.toFixed(6)}`;
    }

    startPredictionTimer() {
        let currentPredictedPrice = this.currentPrice;
        
        this.timer = setInterval(() => {
            // 确保不超过目标价格
            if (currentPredictedPrice >= this.targetPrice) {
                currentPredictedPrice = this.targetPrice;
                this.updatePredictedPriceDisplay(currentPredictedPrice);
                clearInterval(this.timer);
                return;
            }
            
            currentPredictedPrice += this.pricePerSecond;
            this.updatePredictedPriceDisplay(currentPredictedPrice);
            
            // 使用requestAnimationFrame实现平滑动画
            setTimeout(() => {
                this.updateTimeRemaining();
            }, 100);
        }, 1000);
        
        // 添加更频繁的小数位变化定时器，模拟秒表效果
        setInterval(() => {
            if (currentPredictedPrice < this.targetPrice) {
                this.updatePredictedPriceDisplay(currentPredictedPrice);
            }
        }, 200); // 每200毫秒更新一次小数位
    }

    updatePredictedPriceDisplay(price) {
        const predictedElement = document.getElementById('predicted-price');
        
        // 显示到小数点后4位，创建秒表效果
        const formattedPrice = this.formatPriceWithAnimation(price);
        predictedElement.innerHTML = `$${formattedPrice}`;
        
        // 添加秒表般的数字滚动效果，但不改变字体大小
        predictedElement.classList.add('price-tick');
        setTimeout(() => {
            predictedElement.classList.remove('price-tick');
        }, 150);
    }

    formatPriceWithAnimation(price) {
        // 分离整数部分和小数部分
        const integerPart = Math.floor(price);
        const decimalPart = price - integerPart;
        
        // 格式化整数部分（添加千位分隔符）
        const formattedInteger = integerPart.toLocaleString('en-US');
        
        // 格式化小数部分到4位，并添加随机微小变化模拟秒表效果
        const baseDecimal = decimalPart.toFixed(4);
        const lastDigit = Math.floor(Math.random() * 10); // 最后一位随机变化
        const animatedDecimal = baseDecimal.substring(0, baseDecimal.length - 1) + lastDigit;
        
        return `${formattedInteger}.${animatedDecimal.substring(2)}`;
    }



    updateTimeRemaining() {
        const now = new Date();
        const timeRemaining = this.targetDate - now;
        
        if (timeRemaining > 0) {
            const totalSeconds = timeRemaining / 1000;
            const days = Math.floor(totalSeconds / (24 * 60 * 60));
            const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
            const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
            const seconds = Math.floor(totalSeconds % 60);
            
            const progressPercentage = ((this.targetDate - this.startTime - timeRemaining) / (this.targetDate - this.startTime) * 100).toFixed(6);
            
            if (timeRemaining > 0) {
                document.getElementById('time-remaining').textContent = 
                    `距离2033年12月31日还有: ${days}天 ${hours}小时 ${minutes}分钟 ${seconds}秒`;
                
                document.getElementById('growth-rate').textContent = 
                    `预测进度: ${progressPercentage}%`;
            } else {
                document.getElementById('time-remaining').textContent = '已到达目标日期！';
                document.getElementById('growth-rate').textContent = '预测完成！';
            }
        }
    }
}

// 页面加载完成后启动
document.addEventListener('DOMContentLoaded', () => {
    new BitcoinPriceTracker();
});