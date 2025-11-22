import { Brain, Target, Clock, Shield, Zap, Heart } from 'lucide-react'

export default function Philosophy() {
  const principles = [
    {
      icon: Brain,
      title: '长期思维',
      description: '比特币的价值不在于短期波动，而在于其作为全球价值存储的长期潜力。真正的投资者不看日K线，而是看十年价值。'
    },
    {
      icon: Target,
      title: '明确目标',
      description: '100万美元不是凭空想象。这是基于比特币的稀缺性、需求增长和金融体系演变的理性推论。每一次上升都在验证这个愿景。'
    },
    {
      icon: Shield,
      title: '风险承受',
      description: '伟大的收益源于伟大的信念。真正的投资者知道自己在做什么，清楚风险，但坚信长期方向。不是赌博，是有根据的信心。'
    },
    {
      icon: Heart,
      title: '信念坚守',
      description: '在每一次暴跌时，信念被考验。但历史告诉我们，坚守者终将获得回报。价格会波动，但方向不会改变。'
    },
    {
      icon: Zap,
      title: '动量理解',
      description: '制度迁移的力量是深远的。越来越多的机构、国家、个人认可比特币。这个趋势不会逆转，只会加速。'
    },
    {
      icon: Clock,
      title: '时间复利',
      description: '时间是最伟大的投资者的秘密武器。每一年都在改变基本面。坚持足够久，奇迹就会发生。'
    }
  ]

  return (
    <section id="philosophy" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="gradient-text">投资理念</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            成为百万美元信徒需要的不仅是资金，更是正确的心态。
            这些原则指引着每一位真正的长期投资者。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {principles.map((principle, index) => {
            const Icon = principle.icon
            return (
              <div
                key={index}
                className="glass-effect rounded-xl p-8 hover:border-blue-500/50 transition-all duration-300 group cursor-pointer"
              >
                <div className="inline-block p-3 bg-blue-500/20 rounded-lg mb-4 group-hover:bg-blue-500/30 transition-colors">
                  <Icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-blue-300 transition-colors">
                  {principle.title}
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  {principle.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Key Insight */}
        <div className="mt-16 glass-effect rounded-2xl p-12 border-l-4 border-blue-500">
          <blockquote className="text-2xl font-light text-gray-100 italic mb-4">
            "你不必追问浪潮何时涌上沙滩，所有值得期待的潮汐，都在等星辰归位的时刻，等每一朵涟漪在黎明前与晨光的同频。当时间的齿轮咬合一瞬，它们自会以排山倒海之势，掠过每双望向远方的眼睛，请记住那不是突如其来的喧嚣，而是所有等待在时光深处共振的回响。"
          </blockquote>
          <p className="text-gray-400">— 写给所有长期持有者</p>
        </div>
      </div>
    </section>
  )
}
