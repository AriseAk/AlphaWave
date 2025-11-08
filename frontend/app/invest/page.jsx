"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart, ArrowUpRight, ArrowDownRight, Plus, Search, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export default function InvestingPage() {
  const [portfolioValue, setPortfolioValue] = useState(125340.50);
  const [searchStock, setSearchStock] = useState('');
  const [hoveredHolding, setHoveredHolding] = useState(null);
  const [hoveredWatchlist, setHoveredWatchlist] = useState(null);
  const router=useRouter();
  const params=useSearchParams();
  useEffect(() => {
    const token=params.get("token");
    if(token){
      localStorage.setItem("authToken",token)
    }
  }, [])
  
  // Animate portfolio value
  useEffect(() => {
    const interval = setInterval(() => {
      setPortfolioValue(prev => {
        const change = (Math.random() - 0.48) * 100;
        return Math.max(100000, prev + change);
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  const holdings = [
    { symbol: 'AAPL', name: 'Apple Inc.', shares: 50, price: 178.50, change: 2.3, value: 8925, color: 'from-blue-500 to-blue-600' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', shares: 30, price: 378.25, change: -1.2, value: 11347.50, color: 'from-green-500 to-green-600' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', shares: 25, price: 142.80, change: 1.8, value: 3570, color: 'from-red-500 to-red-600' },
    { symbol: 'TSLA', name: 'Tesla Inc.', shares: 15, price: 245.30, change: 4.5, value: 3679.50, color: 'from-purple-500 to-purple-600' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', shares: 20, price: 178.90, change: -0.8, value: 3578, color: 'from-orange-500 to-orange-600' }
  ];

  const watchlist = [
    { symbol: 'NVDA', price: 485.60, change: 3.2 },
    { symbol: 'META', price: 512.30, change: -1.5 },
    { symbol: 'NFLX', price: 628.40, change: 0.9 },
    { symbol: 'AMD', price: 142.80, change: 2.1 }
  ];

  const recentActivity = [
    { type: 'buy', symbol: 'AAPL', shares: 10, price: 178.50, time: '2 hours ago' },
    { type: 'sell', symbol: 'TSLA', shares: 5, price: 240.20, time: '5 hours ago' },
    { type: 'buy', symbol: 'GOOGL', shares: 15, price: 140.50, time: '1 day ago' }
  ];

  const totalGain = 25340.50;
  const totalGainPercent = (totalGain / (portfolioValue - totalGain)) * 100;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 bg-blue-300 rounded-full opacity-20 blur-3xl animate-float"
          style={{ 
            top: '10%', 
            left: '5%',
            animationDelay: '0s'
          }}
        />
        <div 
          className="absolute w-80 h-80 bg-purple-300 rounded-full opacity-20 blur-3xl animate-float"
          style={{ 
            bottom: '10%', 
            right: '10%',
            animationDelay: '2s'
          }}
        />
        <div 
          className="absolute w-64 h-64 bg-pink-300 rounded-full opacity-20 blur-3xl animate-float"
          style={{ 
            top: '50%', 
            left: '50%',
            animationDelay: '1s'
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="bg-white bg-opacity-80 backdrop-blur-lg border-b border-blue-100 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-90">
                        <TrendingUp className="w-8 h-8 text-blue-500" />
                        <span className="text-2xl font-semibold text-gray-800">AlphaWave</span>
                    </Link>
            <div className="flex items-center space-x-6">
              <button className="text-gray-600 hover:text-blue-500 transition-all duration-300 hover:scale-110">Dashboard</button>
              <button className="text-blue-500 font-medium hover:scale-110 transition-transform duration-300">Portfolio</button>
              <button className="text-gray-600 hover:text-blue-500 transition-all duration-300 hover:scale-110">Learn</button>
              <button className="text-gray-600 hover:text-blue-500 transition-all duration-300 hover:scale-110">Compete</button>
              <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium transform hover:scale-110 transition-all duration-300 cursor-pointer">
                JD
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Portfolio Overview */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-6 flex items-center">
            Your Portfolio
            <Sparkles className="ml-3 text-yellow-500 animate-pulse" />
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white bg-opacity-90 backdrop-blur-xl rounded-2xl p-6 border border-blue-100 shadow-lg col-span-2 transform hover:scale-105 transition-all duration-500 hover:shadow-2xl animate-fade-in" style={{ animationDelay: '100ms' }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Portfolio Value</p>
                  <h2 className="text-4xl font-bold text-gray-900 transition-all duration-300">
                    ${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </h2>
                </div>
                <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse-slow shadow-lg">
                  <DollarSign className="w-10 h-10 text-white" />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className={`flex items-center ${totalGainPercent >= 0 ? 'text-green-600' : 'text-red-600'} transition-all duration-500`}>
                  {totalGainPercent >= 0 ? <ArrowUpRight className="w-6 h-6 animate-bounce" /> : <ArrowDownRight className="w-6 h-6 animate-bounce" />}
                  <span className="text-xl font-semibold ml-1">
                    ${Math.abs(totalGain).toLocaleString('en-US', { minimumFractionDigits: 2 })} ({totalGainPercent.toFixed(2)}%)
                  </span>
                </div>
                <span className="text-sm text-gray-500">All Time</span>
              </div>
            </div>

            <div className="bg-linear-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-2xl transform hover:scale-105 transition-all duration-500 hover:rotate-1 relative overflow-hidden animate-fade-in" style={{ animationDelay: '200ms' }}>
              <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-300" />
              <p className="text-sm text-blue-100 mb-2">Buying Power</p>
              <h3 className="text-4xl font-bold mb-4">$74,659.50</h3>
              <button className="w-full bg-white text-blue-500 py-3 rounded-xl hover:bg-blue-50 transition-all duration-300 font-medium flex items-center justify-center transform hover:scale-105 hover:shadow-lg">
                <Plus className="w-5 h-5 mr-2" />
                Add Funds
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Holdings */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white bg-opacity-90 backdrop-blur-xl rounded-2xl border border-blue-100 shadow-lg animate-fade-in" style={{ animationDelay: '300ms' }}>
              <div className="p-6 border-b border-blue-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Holdings</h2>
                  <div className="relative group">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 transition-all duration-300 group-hover:scale-110" />
                    <input
                      type="text"
                      value={searchStock}
                      onChange={(e) => setSearchStock(e.target.value)}
                      className="pl-10 pr-4 py-2 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-transparent text-sm transition-all duration-300"
                      placeholder="Search stocks..."
                    />
                  </div>
                </div>
              </div>

              <div className="divide-y divide-blue-100">
                {holdings.map((holding, index) => (
                  <div 
                    key={index} 
                    className="p-6 hover:bg-linear-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-500 cursor-pointer transform hover:scale-105"
                    onMouseEnter={() => setHoveredHolding(index)}
                    onMouseLeave={() => setHoveredHolding(null)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className={`w-14 h-14 bg-linear-to-br ${holding.color} rounded-xl flex items-center justify-center transform transition-all duration-500 ${hoveredHolding === index ? 'rotate-12 scale-110' : ''} shadow-lg`}>
                            <span className="font-bold text-white text-sm">{holding.symbol}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">{holding.symbol}</h3>
                            <p className="text-sm text-gray-500">{holding.name}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right mr-8">
                        <p className="font-semibold text-gray-900">{holding.shares} shares</p>
                        <p className="text-sm text-gray-500">${holding.price}</p>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-gray-900 text-lg">${holding.value.toLocaleString()}</p>
                        <div className={`flex items-center justify-end text-sm font-medium ${holding.change >= 0 ? 'text-green-600' : 'text-red-600'} transition-all duration-300`}>
                          {holding.change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                          {Math.abs(holding.change)}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white bg-opacity-90 backdrop-blur-xl rounded-2xl border border-blue-100 shadow-lg animate-fade-in" style={{ animationDelay: '400ms' }}>
              <div className="p-6 border-b border-blue-100">
                <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
              </div>
              <div className="divide-y divide-blue-100">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="p-6 hover:bg-linear-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transform hover:scale-110 transition-all duration-300 shadow-md ${activity.type === 'buy' ? 'bg-linear-to-br from-green-400 to-green-600' : 'bg-linear-to-br from-red-400 to-red-600'}`}>
                          {activity.type === 'buy' ? (
                            <ArrowUpRight className="w-6 h-6 text-white" />
                          ) : (
                            <ArrowDownRight className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {activity.type === 'buy' ? 'Bought' : 'Sold'} {activity.shares} {activity.symbol}
                          </p>
                          <p className="text-sm text-gray-500">${activity.price} per share</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Watchlist */}
            <div className="bg-white bg-opacity-90 backdrop-blur-xl rounded-2xl border border-blue-100 shadow-lg animate-fade-in" style={{ animationDelay: '500ms' }}>
              <div className="p-6 border-b border-blue-100">
                <h2 className="text-xl font-bold text-gray-900">Watchlist</h2>
              </div>
              <div className="divide-y divide-blue-100">
                {watchlist.map((stock, index) => (
                  <div 
                    key={index} 
                    className="p-4 hover:bg-linear-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 cursor-pointer transform hover:scale-105"
                    onMouseEnter={() => setHoveredWatchlist(index)}
                    onMouseLeave={() => setHoveredWatchlist(null)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900 text-lg">{stock.symbol}</p>
                        <p className="text-sm text-gray-500">${stock.price}</p>
                      </div>
                      <div className={`flex items-center text-sm font-medium transition-all duration-300 ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'} ${hoveredWatchlist === index ? 'scale-110' : ''}`}>
                        {stock.change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                        {Math.abs(stock.change)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-blue-100">
                <button className="w-full text-blue-500 hover:text-blue-600 font-medium text-sm transition-all duration-300 hover:scale-105">
                  + Add to Watchlist
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-linear-to-br from-blue-100 via-purple-100 to-pink-100 rounded-2xl p-6 border border-blue-200 shadow-lg transform hover:scale-105 transition-all duration-500 animate-fade-in" style={{ animationDelay: '600ms' }}>
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Today&apos;s Return</span>
                  <span className="text-sm font-semibold text-green-600 flex items-center">
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    +$1,234.50
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Invested</span>
                  <span className="text-sm font-semibold text-gray-900">$100,000.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Return</span>
                  <span className="text-sm font-semibold text-green-600 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +25.34%
                  </span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button className="w-full bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-4 rounded-2xl hover:shadow-2xl transition-all duration-500 font-medium flex items-center justify-center transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden group animate-fade-in" style={{ animationDelay: '700ms' }}>
              <span className="relative z-10 flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Buy New Stock
              </span>
              <div className="absolute inset-0 bg-linear-to-r from-pink-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -20px) scale(1.05); }
          50% { transform: translate(-15px, 15px) scale(0.95); }
          75% { transform: translate(15px, 20px) scale(1.02); }
        }
        
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}