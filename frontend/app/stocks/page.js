"use client";

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Search, Filter, Star, Plus, ArrowUpRight, ArrowDownRight, BarChart3, Sparkles , User , LogOut} from 'lucide-react';
import Link from 'next/link';

export default function StocksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [hoveredStock, setHoveredStock] = useState(null);

  const categories = ['All', 'Tech', 'Finance', 'Healthcare', 'Energy', 'Consumer'];

  const stocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 178.50, change: 2.3, volume: '52.3M', marketCap: '2.8T', category: 'Tech', color: 'from-blue-500 to-blue-600' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.25, change: -1.2, volume: '23.1M', marketCap: '2.8T', category: 'Tech', color: 'from-green-500 to-green-600' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.80, change: 1.8, volume: '28.5M', marketCap: '1.8T', category: 'Tech', color: 'from-red-500 to-red-600' },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 245.30, change: 4.5, volume: '98.7M', marketCap: '778B', category: 'Tech', color: 'from-purple-500 to-purple-600' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.90, change: -0.8, volume: '45.2M', marketCap: '1.8T', category: 'Consumer', color: 'from-orange-500 to-orange-600' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 485.60, change: 3.2, volume: '62.8M', marketCap: '1.2T', category: 'Tech', color: 'from-green-400 to-green-500' },
    { symbol: 'META', name: 'Meta Platforms', price: 512.30, change: -1.5, volume: '18.9M', marketCap: '1.3T', category: 'Tech', color: 'from-blue-400 to-blue-500' },
    { symbol: 'JPM', name: 'JPMorgan Chase', price: 198.45, change: 0.7, volume: '12.4M', marketCap: '580B', category: 'Finance', color: 'from-indigo-500 to-indigo-600' },
    { symbol: 'JNJ', name: 'Johnson & Johnson', price: 156.75, change: -0.3, volume: '8.3M', marketCap: '385B', category: 'Healthcare', color: 'from-pink-500 to-pink-600' },
    { symbol: 'XOM', name: 'Exxon Mobil', price: 112.30, change: 2.1, volume: '15.7M', marketCap: '450B', category: 'Energy', color: 'from-red-400 to-red-500' },
    { symbol: 'BAC', name: 'Bank of America', price: 34.85, change: 1.2, volume: '38.2M', marketCap: '275B', category: 'Finance', color: 'from-blue-600 to-blue-700' },
    { symbol: 'PFE', name: 'Pfizer Inc.', price: 28.90, change: -2.1, volume: '42.1M', marketCap: '162B', category: 'Healthcare', color: 'from-teal-500 to-teal-600' },
  ];

  const filteredStocks = stocks.filter(stock => {
    const matchesSearch = stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         stock.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || stock.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const marketStats = [
    { label: 'S&P 500', value: '4,783.45', change: 0.8, color: 'from-blue-500 to-blue-600' },
    { label: 'Dow Jones', value: '37,440.34', change: 0.5, color: 'from-green-500 to-green-600' },
    { label: 'NASDAQ', value: '15,043.97', change: 1.2, color: 'from-purple-500 to-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-300 rounded-full opacity-20 blur-3xl animate-float" style={{ top: '10%', left: '5%', animationDelay: '0s' }} />
        <div className="absolute w-80 h-80 bg-purple-300 rounded-full opacity-20 blur-3xl animate-float" style={{ bottom: '10%', right: '10%', animationDelay: '2s' }} />
        <div className="absolute w-64 h-64 bg-pink-300 rounded-full opacity-20 blur-3xl animate-float" style={{ top: '50%', left: '50%', animationDelay: '1s' }} />
      </div>

      {/* Navigation */}
      <nav className="bg-white bg-opacity-80 backdrop-blur-lg border-b border-blue-100 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-90">
                            <TrendingUp className="w-8 h-8 text-blue-500" />
                            <span className="text-2xl font-semibold text-gray-800">AlphaWave</span>
                        </Link>
            <div className="flex items-center space-x-4">
              <Link href="/stocks"><button className="text-gray-600 hover:text-blue-500 transition-all duration-300 hover:scale-110 text-sm">Stocks</button></Link>
              <Link href="/invest"><button className="text-blue-500 font-medium hover:scale-110 transition-transform duration-300 text-sm">Portfolio</button></Link>
              <Link href="/learn"><button className="text-gray-600 hover:text-blue-500 transition-all duration-300 hover:scale-110 text-sm">Learn</button></Link>
              <Link href="/compete"><button className="text-gray-600 hover:text-blue-500 transition-all duration-300 hover:scale-110 text-sm">Compete</button></Link>
              <button 
                onClick={() => {
                  localStorage.removeItem('authToken');
                  window.location.href = '/';
                }}
                className="text-red-600 hover:text-red-700 transition-all duration-300 hover:scale-110 text-sm font-medium"
              >
                <LogOut/>
              </button>
              <Link href="/profile"><div className="w-8 h-8 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium transform hover:scale-110 transition-all duration-300 cursor-pointer text-xs">
                <User />
              </div></Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-4 relative z-10">
        {/* Market Overview */}
        <div className="mb-4 animate-fade-in">
          <h1 className="text-2xl font-bold text-gray-900 mb-3 flex items-center">
            Market Overview
            <Sparkles className="ml-2 w-5 h-5 text-yellow-500 animate-pulse" />
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {marketStats.map((stat, index) => (
              <div key={index} className={`bg-linear-to-br ${stat.color} rounded-xl p-4 text-white shadow-lg transform hover:scale-105 transition-all duration-500 animate-fade-in`} style={{ animationDelay: `${index * 100}ms` }}>
                <p className="text-xs text-white text-opacity-80 mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                <div className="flex items-center text-sm">
                  {stat.change >= 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                  <span>{stat.change >= 0 ? '+' : ''}{stat.change}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white bg-opacity-90 backdrop-blur-xl rounded-xl p-4 border border-blue-100 shadow-lg mb-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent text-sm transition-all duration-300"
                placeholder="Search stocks by symbol or name..."
              />
            </div>
            
            <div className="flex items-center space-x-2 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-linear-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stocks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStocks.map((stock, index) => (
            <div
              key={index}
              className="bg-white bg-opacity-90 backdrop-blur-xl rounded-xl border border-blue-100 shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-500 cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
              onMouseEnter={() => setHoveredStock(index)}
              onMouseLeave={() => setHoveredStock(null)}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 bg-linear-to-br ${stock.color} rounded-lg flex items-center justify-center transform transition-all duration-500 ${hoveredStock === index ? 'rotate-12 scale-110' : ''} shadow-lg`}>
                      <span className="font-bold text-white text-xs">{stock.symbol}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{stock.symbol}</h3>
                      <p className="text-xs text-gray-500">{stock.name}</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-yellow-500 transition-colors duration-300">
                    <Star className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-end justify-between mb-3">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">${stock.price}</p>
                    <p className="text-xs text-gray-500">Market Cap: {stock.marketCap}</p>
                  </div>
                  <div className={`flex items-center text-sm font-semibold ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stock.change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                    {stock.change >= 0 ? '+' : ''}{stock.change}%
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span className="flex items-center">
                    <BarChart3 className="w-3 h-3 mr-1" />
                    Vol: {stock.volume}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                    {stock.category}
                  </span>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-linear-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg hover:shadow-lg transition-all duration-300 text-sm font-medium flex items-center justify-center">
                    <Plus className="w-4 h-4 mr-1" />
                    Buy
                  </button>
                  <Link href="/performance" className="flex-1">
  <button className="w-full border-2 border-blue-500 text-blue-500 py-2 rounded-lg hover:bg-blue-50 transition-all duration-300 text-sm font-medium relative overflow-hidden group">
    <span className="relative z-10 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-0">
      Details
      <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </span>
    <div className="absolute inset-0 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
    <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
      View More
      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </span>
  </button>
</Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredStocks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No stocks found matching your search.</p>
          </div>
        )}
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
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}