class BitcoinTracker {
    constructor() {
        this.currentPrice = null;
        this.historicalData = [];
        this.chart = null;
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
        
        // 清空画布
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
        
        // 计算绘图区域
        const padding = 40;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;
        
        // 计算数据范围
        const minPrice = Math.min(...data);
        const maxPrice = Math.max(...data);
        const priceRange = maxPrice - minPrice;
        
        // 绘制网格线
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        
        // 垂直网格线
        for (let i = 0; i <= 6; i++) {
            const x = padding + (chartWidth / 6) * i;
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, padding + chartHeight);
            ctx.stroke();
        }
        
        // 水平网格线
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
        
        // 绘制Y轴标签
        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        
        for (let i = 0; i <= 4; i++) {
            const price = minPrice + (priceRange / 4) * (4 - i);
            const y = padding + (chartHeight / 4) * i;
            ctx.fillText('$' + this.formatNumber(price), padding - 10, y + 4);
        }
        
        // 绘制X轴标签
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
        // 每5分钟自动刷新一次显示
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
        // 移除现有消息
        const existingMessage = document.querySelector('.error-message, .success-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // 创建新消息
        const messageDiv = document.createElement('div');
        messageDiv.className = type === 'error' ? 'error-message' : 'success-message';
        messageDiv.textContent = message;

        // 插入到价格卡片后面
        const priceCard = document.querySelector('.price-card');
        priceCard.parentNode.insertBefore(messageDiv, priceCard.nextSibling);

        // 3秒后自动移除
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new BitcoinTracker();
});