import React, { useState, useEffect } from 'react';
import { TrendingUp, Lock, Zap, Infinity, Target } from 'lucide-react';

const TARGET_PRICE = 1000000;

function App() {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPrice = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setPrice(data.bitcoin.usd);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch price", err);
      setError("无法连接到市场数据");
      // Fallback price just for visual testing if API fails (optional, but good for stability)
      // setPrice(65000); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const calculateStats = (currentPrice) => {
    if (!currentPrice) return {};
    const gap = TARGET_PRICE - currentPrice;
    const progress = (currentPrice / TARGET_PRICE) * 100;
    const multiplier = TARGET_PRICE / currentPrice;
    return { gap, progress, multiplier };
  };

  const stats = calculateStats(price);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center font-sans">
      {/* Header Section */}
      <header className="mb-12 animate-fade-in">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
          百万美元之路
        </h1>
        <p className="text-gray-400 text-sm tracking-[0.3em] uppercase">The Road to 1 Million USD</p>
      </header>

      {/* Main Data Display */}
      <main className="w-full max-w-3xl space-y-12">
        
        {/* Price Card */}
        <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-8 md:p-12 shadow-2xl border-glow relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-bitcoin to-transparent opacity-50"></div>
          
          {loading ? (
            <div className="animate-pulse text-2xl text-gray-500">正在连接区块链网络...</div>
          ) : error ? (
            <div className="text-red-400">
              <p>{error}</p>
              <button onClick={fetchPrice} className="mt-4 text-sm underline">重试</button>
            </div>
          ) : (
            <div className="space-y-8">
              <div>
                <p className="text-gray-500 text-sm uppercase tracking-widest mb-2">Current Price</p>
                <div className="text-5xl md:text-7xl font-mono font-bold text-white tracking-tighter text-glow">
                  {formatCurrency(price)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gray-800">
                <StatBox 
                  label="距离目标" 
                  value={formatCurrency(stats.gap)} 
                  sub="Gap to $1M"
                />
                <StatBox 
                  label="达成进度" 
                  value={`${stats.progress.toFixed(2)}%`} 
                  sub="Progress"
                  highlight
                />
                <StatBox 
                  label="增值空间" 
                  value={`${stats.multiplier.toFixed(1)}x`} 
                  sub="Multiplier"
                />
              </div>

              {/* Progress Bar */}
              <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden mt-8">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-600 to-yellow-400 transition-all duration-1000 ease-out"
                  style={{ width: `${stats.progress}%` }}
                >
                  <div className="absolute top-0 right-0 h-full w-1 bg-white opacity-50 animate-pulse"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <InfoCard 
            icon={<Lock className="text-bitcoin" />}
            title="数字稀缺性"
            text="总量恒定 2100 万枚。在这个不断通胀的世界里，拥有绝对稀缺的资产是保护财富的唯一途径。这不是投机，这是数学确定的未来。"
          />
          <InfoCard 
            icon={<TrendingUp className="text-green-400" />}
            title="长期视野"
            text="短期波动是市场的噪音，长期上涨是价值的回归。100万美元不仅仅是一个价格目标，它是法币体系崩溃的注脚。"
          />
          <InfoCard 
            icon={<Zap className="text-yellow-400" />}
            title="能量锚定"
            text="比特币是世界上第一个将能源转化为价值的货币网络。它是物理世界与数字世界的完美桥梁，坚不可摧。"
          />
          <InfoCard 
            icon={<Target className="text-red-400" />}
            title="保持耐心"
            text="通往一百万美元的道路不会是一条直线。会有质疑，会有恐慌。但最终，数学法则将战胜人类的情绪。"
          />
        </div>

        <div className="py-12 text-gray-500 text-sm">
          <p className="italic">"If you don't believe me or don't get it, I don't have time to try to convince you, sorry."</p>
          <p className="mt-2 font-mono">— Satoshi Nakamoto</p>
        </div>

      </main>
    </div>
  );
}

function StatBox({ label, value, sub, highlight }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-gray-500 text-xs mb-1">{label}</span>
      <span className={`text-2xl font-mono font-bold ${highlight ? 'text-bitcoin' : 'text-gray-200'}`}>
        {value}
      </span>
      <span className="text-gray-600 text-[10px] uppercase tracking-wide mt-1">{sub}</span>
    </div>
  );
}

function InfoCard({ icon, title, text }) {
  return (
    <div className="bg-gray-900/30 border border-gray-800/50 p-6 rounded-xl hover:bg-gray-800/50 transition-colors duration-300">
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <h3 className="font-bold text-gray-200">{title}</h3>
      </div>
      <p className="text-gray-400 text-sm leading-relaxed">
        {text}
      </p>
    </div>
  );
}

export default App;
