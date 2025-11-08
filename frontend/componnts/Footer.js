import React from 'react'
import { TrendingUp } from 'lucide-react'

const Footer = () => {
  return (
    <>
    {/* Footer */}
      <footer className="bg-white border-t border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <TrendingUp className="w-6 h-6 text-blue-500" />
              <span className="text-xl font-semibold text-gray-800">AlphaWave</span>
            </div>
            <div className="flex space-x-6 text-gray-600 text-sm">
              <a href="#" className="hover:text-blue-500 transition">Privacy</a>
              <a href="#" className="hover:text-blue-500 transition">Terms</a>
              <a href="#" className="hover:text-blue-500 transition">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer