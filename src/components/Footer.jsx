import { Heart, Github, Twitter } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-200 py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">关于本站</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              这是为所有比特币长期投资者创建的娱乐工具，
              帮助我们一起追踪这个伟大的梦想——
              比特币百万美元之旅。
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">免责声明</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              本站仅供信息和娱乐之用，非投资建议。
              数据来自第三方 API，不保证绝对准确。
              请做自己的研究，对自己的决定负责。
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">相关资源</h4>
            <ul className="text-gray-600 text-sm space-y-2">
              <li><a href="https://bitcoin.org" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors duration-200">Bitcoin.org</a></li>
              <li><a href="https://www.coindesk.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors duration-200">CoinDesk</a></li>
              <li><a href="https://www.coingecko.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors duration-200">CoinGecko</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm flex items-center gap-2 mb-4 md:mb-0">
              Made with <Heart className="w-4 h-4 text-red-500" /> for Bitcoin believers
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors duration-200">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors duration-200">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
          <p className="text-gray-500 text-xs text-center mt-4">
            © {currentYear} Bitcoin $1M Journey. All rights reserved. | Built with React & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  )
}
