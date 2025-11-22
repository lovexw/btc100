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
      
      // Using AHR999 API
      const response = await fetch(
        'https://ahr999.btchao.com/api/ahr999/latest'
      )
      
      if (!response.ok) throw new Error('Failed to fetch price')
      
      const data = await response.json()
      const price = data.currentPrice
      
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

  const generateMilestones = () => {
    const milestones = []
    for (let i = 1; i <= 20; i++) {
      const price = i * 50000
      const label = price >= 1000000 ? `$${(price / 1000000).toFixed(1)}M` : `$${(price / 1000).toFixed(0)}k`
      milestones.push({
        price,
        label,
        reached: btcPrice >= price
      })
    }
    return milestones
  }

  return (
    <section id="tracker" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">
            <span className="gradient-text">实时追踪</span>
          </h2>
          <p className="text-gray-600 text-lg">距离百万美元还有多远</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Main Price Display */}
          <div className="glass-effect rounded-2xl p-8 lg:col-span-2">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-gray-600 text-sm mb-2">当前比特币价格</p>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader className="w-6 h-6 animate-spin text-orange-500" />
                    <span className="text-gray-600">正在加载...</span>
                  </div>
                ) : (
                  <h3 className="text-5xl sm:text-6xl font-bold text-gray-900">
                    ${btcPrice?.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </h3>
                )}
              </div>
              <div className="text-right">
                <p className="text-gray-600 text-sm">目标价格</p>
                <p className="text-4xl font-bold text-orange-500">$1,000,000</p>
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
                <h4 className="text-lg font-semibold text-gray-900">进度</h4>
                <span className="text-2xl font-bold text-orange-500">{percentage.toFixed(2)}%</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 transition-all duration-500"
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                已达成 <span className="text-orange-600 font-semibold">{percentage.toFixed(2)}%</span> 的目标
              </p>
            </div>
          </div>

          {/* Gap Analysis */}
          <div className="glass-effect rounded-2xl p-8">
            <h4 className="text-lg font-semibold mb-4 text-gray-900">距离分析</h4>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 text-sm mb-1">需要上升</p>
                <p className="text-3xl font-bold text-orange-500">
                  {increase?.toFixed(2)}x
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">还需上升</p>
                <p className="text-2xl font-bold text-orange-600">
                  ${remaining?.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline/Milestone Info */}
        <div className="glass-effect rounded-2xl p-8">
          <h4 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-900">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            关键里程碑
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-10 gap-2">
            {generateMilestones().map((milestone) => (
              <div
                key={milestone.price}
                className={`p-3 rounded-lg transition-all duration-300 text-center ${
                  milestone.reached
                    ? 'bg-orange-100 border border-orange-300'
                    : 'bg-gray-100 border border-gray-300'
                }`}
              >
                <p className="text-xs text-gray-700">{milestone.label}</p>
                <p className={`text-sm font-semibold ${milestone.reached ? 'text-orange-600' : 'text-gray-500'}`}>
                  {milestone.reached ? '✓' : '◯'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
