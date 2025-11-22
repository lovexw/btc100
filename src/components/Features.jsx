import { BarChart3, Globe, RefreshCw, Lock } from 'lucide-react'

export default function Features() {
  const features = [
    {
      icon: RefreshCw,
      title: '实时更新',
      description: '每分钟自动更新比特币价格，让你随时掌握最新行情'
    },
    {
      icon: BarChart3,
      title: '数据可视化',
      description: '清晰的进度条和数据展示，直观了解距离目标还有多远'
    },
    {
      icon: Globe,
      title: '全球视角',
      description: '基于全球实时行情数据，不受单一市场影响的真实价格'
    },
    {
      icon: Lock,
      title: '隐私优先',
      description: '无需登录，无需存储任何个人数据，完全尊重用户隐私'
    }
  ]

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="gradient-text">功能特性</span>
          </h2>
          <p className="text-gray-400 text-lg">这个工具为长期投资者而设计</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="glass-effect rounded-xl p-8 flex gap-6">
                <div className="flex-shrink-0">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <Icon className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: '用户信念', value: '∞' },
            { label: '目标价格', value: '$1M' },
            { label: '需要耐心', value: '⏳' },
            { label: '成功概率', value: '📈' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-3xl font-bold text-blue-400 mb-2">{stat.value}</p>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
