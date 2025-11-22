import { Bitcoin } from 'lucide-react'

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-40 backdrop-blur-md bg-white/80 border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bitcoin className="w-8 h-8 text-orange-500" />
          <span className="text-2xl font-bold gradient-text">Bitcoin $1M</span>
        </div>
        <div className="hidden md:flex gap-8">
          <a href="#tracker" className="text-gray-700 hover:text-orange-500 transition-colors duration-200">追踪</a>
          <a href="#philosophy" className="text-gray-700 hover:text-orange-500 transition-colors duration-200">理念</a>
          <a href="#features" className="text-gray-700 hover:text-orange-500 transition-colors duration-200">特性</a>
        </div>
      </nav>
    </header>
  )
}
