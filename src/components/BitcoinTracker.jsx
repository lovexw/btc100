import { useState, useEffect } from 'react'
import { TrendingUp, Loader, AlertCircle } from 'lucide-react'

const TARGET_PRICE = 1000000

export default function BitcoinTracker() {
  const [btcPrice, setBtcPrice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [priceHistory, setPriceHistory] = useState([])
  const [lastUpdate, setLastUpdate] = useState(null)

  const fetchBTCPrice = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Using free crypto API
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true&include_market_cap=true'
      )
      
      if (!response.ok) throw new Error('Failed to fetch price')
      
      const data = await response.json()
      const price = data.bitcoin.usd
      const change24h = data.bitcoin.usd_24h_change
      
      setBtcPrice(price)
      setLastUpdate(new Date())
      
      // Keep price history for trend
      setPriceHistory(prev => [...prev.slice(-9), price])
      
    } catch (err) {
      setError(err.message || 'Unable to fetch Bitcoin price')
      console.error('Price fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBTCPrice()
    const interval = setInterval(fetchBTCPrice, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  const remaining = btcPrice ? TARGET_PRICE - btcPrice : 0
  const percentage = btcPrice ? (btcPrice / TARGET_PRICE) * 100 : 0
  const increase = btcPrice ? TARGET_PRICE / btcPrice : 0

  return (
    <section id="tracker" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="gradient-text">实时追踪</span>
          </h2>
          <p className="text-gray-400 text-lg">距离百万美元还有多远</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-300">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Main Price Display */}
          <div className="glass-effect rounded-2xl p-8 lg:col-span-2">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-gray-400 text-sm mb-2">当前比特币价格</p>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader className="w-6 h-6 animate-spin text-blue-400" />
                    <span className="text-gray-400">正在加载...</span>
                  </div>
                ) : (
                  <h3 className="text-5xl sm:text-6xl font-bold text-blue-400">
                    ${btcPrice?.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </h3>
                )}
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm">目标价格</p>
                <p className="text-4xl font-bold text-purple-400">$1,000,000</p>
              </div>
            </div>
            {lastUpdate && (
              <p className="text-xs text-gray-500">最后更新: {lastUpdate.toLocaleTimeString('zh-CN')}</p>
            )}
          </div>

          {/* Progress Visualization */}
          <div className="glass-effect rounded-2xl p-8">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold">进度</h4>
                <span className="text-2xl font-bold text-green-400">{percentage.toFixed(2)}%</span>
              </div>
              <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500"
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-400 mt-4">
                已达成 <span className="text-green-400 font-semibold">{percentage.toFixed(2)}%</span> 的目标
              </p>
            </div>
          </div>

          {/* Gap Analysis */}
          <div className="glass-effect rounded-2xl p-8">
            <h4 className="text-lg font-semibold mb-4">距离分析</h4>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">需要上升</p>
                <p className="text-3xl font-bold text-orange-400">
                  {increase?.toFixed(2)}x
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">还需上升</p>
                <p className="text-2xl font-bold text-pink-400">
                  ${remaining?.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline/Milestone Info */}
        <div className="glass-effect rounded-2xl p-8">
          <h4 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            关键里程碑
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: '10k美元', reached: btcPrice >= 10000, year: '2017' },
              { label: '50k美元', reached: btcPrice >= 50000, year: '2021' },
              { label: '100k美元', reached: btcPrice >= 100000, year: '2024' },
              { label: '100万美元', reached: btcPrice >= 1000000, year: '?' },
            ].map((milestone) => (
              <div
                key={milestone.label}
                className={`p-4 rounded-lg transition-all duration-300 ${
                  milestone.reached
                    ? 'bg-green-500/20 border border-green-500/50'
                    : 'bg-slate-700/30 border border-slate-600/50'
                }`}
              >
                <p className="text-sm text-gray-400">{milestone.label}</p>
                <p className={`text-lg font-semibold ${milestone.reached ? 'text-green-400' : 'text-gray-400'}`}>
                  {milestone.reached ? '✓ 已达成' : '◯ 进行中'}
                </p>
                <p className="text-xs text-gray-500 mt-1">{milestone.year}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
