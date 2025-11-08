"use client"

import Image from "next/image";
import { TrendingUp, BarChart3, Brain, Globe, BookOpen, Target, Users, Trophy, ArrowUp, ArrowDown } from "lucide-react";
import { useState, useEffect } from "react";
import Navbar from "../componnts/Navbar";
import Link from "next/link";

export default function Home() {

  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [stockPrice, setStockPrice] = useState(100);
  const [priceHistory, setPriceHistory] = useState([100]);
  const [portfolioValue, setPortfolioValue] = useState(100000);
  const [gainPercent, setGainPercent] = useState(0);

   useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animate stock price
  useEffect(() => {
    const interval = setInterval(() => {
      setStockPrice(prev => {
        const change = (Math.random() - 0.5) * 5;
        const newPrice = Math.max(50, Math.min(150, prev + change));
        setPriceHistory(history => [...history.slice(-20), newPrice]);
        return newPrice;
      });
      
      setPortfolioValue(prev => {
        const change = (Math.random() - 0.48) * 1000;
        return Math.max(90000, Math.min(150000, prev + change));
      });
      
      setGainPercent((Math.random() - 0.5) * 10);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: TrendingUp,
      title: "Virtual Trading",
      description: "Practice with simulated money in a risk-free environment"
    },
    {
      icon: BarChart3,
      title: "Real-Time Analysis",
      description: "Visual stock analysis with live market data and news impact"
    },
    {
      icon: Brain,
      title: "AI Assistant",
      description: "Get instant answers to your trading and investment questions"
    },
    {
      icon: Globe,
      title: "Global Trading Map",
      description: "3D visualization of trading activity across different regions"
    },
    {
      icon: BookOpen,
      title: "Learning Roadmap",
      description: "Structured courses with videos and interactive challenges"
    },
    {
      icon: Target,
      title: "Backtesting Engine",
      description: "Test your strategies against historical market data"
    },
    {
      icon: Users,
      title: "Social Trading",
      description: "Challenge friends in 1v1 or group trading competitions"
    },
    {
      icon: Trophy,
      title: "Learn & Earn",
      description: "Complete challenges to earn virtual currency for trading"
    }
  ];

  // Calculate effects
  const heroOpacity = Math.max(0, 1 - scrollY / 500);
  const bgColorIntensity = Math.min(scrollY / 1000, 1);
  const bgColor = `rgb(${239 - bgColorIntensity * 15}, ${246 - bgColorIntensity * 26}, ${255 - bgColorIntensity * 30})`;

  // Calculate SVG path for line chart
  const svgWidth = 300;
  const svgHeight = 80;
  const points = priceHistory.slice(-15);
  const maxPrice = Math.max(...points);
  const minPrice = Math.min(...points);
  const priceRange = maxPrice - minPrice || 1;
  
  const pathData = points.map((price, i) => {
    const x = (i / (points.length - 1)) * svgWidth;
    const y = svgHeight - ((price - minPrice) / priceRange) * svgHeight;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <>
    <Navbar/>
    <div className="min-h-screen transition-colors duration-500" style={{ backgroundColor: bgColor }}>
      {/* Hero Section with Live Trading Demo */}
      <section className="max-w-7xl mx-auto px-6 py-20 pt-32">
        <div className="text-center max-w-3xl mx-auto" style={{ opacity: heroOpacity, transform: `translateY(${scrollY * 0.3}px)` }}>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Master Trading Without Risk
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Learn, practice, and perfect your trading strategies in a simulated environment with real market data
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-lg font-medium">
              Start Trading
            </button>
            <button className="px-8 py-3 border-2 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition text-lg font-medium">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Live Trading Dashboard Preview */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-xl border border-blue-100 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            {/* Portfolio Value */}
            <div className="bg-linear-to-br from-blue-50 to-white rounded-xl p-6 border border-blue-100">
              <div className="text-sm text-gray-600 mb-2">Portfolio Value</div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                ${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className={`flex items-center text-sm ${gainPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {gainPercent >= 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                {Math.abs(gainPercent).toFixed(2)}% Today
              </div>
            </div>

            {/* Stock Price */}
            <div className="bg-linear-to-br from-blue-50 to-white rounded-xl p-6 border border-blue-100">
              <div className="text-sm text-gray-600 mb-2">Sample Stock Price</div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                ${stockPrice.toFixed(2)}
              </div>
              <div className={`flex items-center text-sm ${stockPrice >= priceHistory[priceHistory.length - 2] ? 'text-green-600' : 'text-red-600'}`}>
                {stockPrice >= priceHistory[priceHistory.length - 2] ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                Live Demo
              </div>
            </div>
          </div>

          {/* Live Chart */}
          <div className="bg-linear-to-br from-blue-50 to-white rounded-xl p-6 border border-blue-100">
            <div className="text-sm text-gray-600 mb-4">Live Price Movement</div>
            <svg width="100%" height="120" viewBox={`0 0 ${svgWidth} ${svgHeight + 20}`} className="overflow-visible">
              {/* Grid lines */}
              <line x1="0" y1={svgHeight} x2={svgWidth} y2={svgHeight} stroke="#e5e7eb" strokeWidth="1" />
              <line x1="0" y1={svgHeight / 2} x2={svgWidth} y2={svgHeight / 2} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4" />
              
              {/* linear fill */}
              <defs>
                <linearlinear id="linelinear" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                </linearlinear>
              </defs>
              
              {/* Area under the line */}
              <path
                d={`${pathData} L ${svgWidth} ${svgHeight} L 0 ${svgHeight} Z`}
                fill="url(#linelinear)"
              />
              
              {/* Line */}
              <path
                d={pathData}
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2"
                className="transition-all duration-500"
              />
              
              {/* Points */}
              {points.map((price, i) => {
                const x = (i / (points.length - 1)) * svgWidth;
                const y = svgHeight - ((price - minPrice) / priceRange) * svgHeight;
                return (
                  <circle
                    key={i}
                    cx={x.toString()}
                    cy={y}
                    r={i === points.length - 1 ? "4" : "0"}
                    fill="#3B82F6"
                    className="transition-all duration-500"
                  >
                    {i === points.length - 1 && (
                      <animate
                        attributeName="r"
                        values="4;6;4"
                        dur="1s"
                        repeatCount="indefinite"
                      />
                    )}
                  </circle>
                );
              })}
            </svg>
            <div className="text-xs text-gray-500 text-center mt-2">
              Real-time simulation updates every 2 seconds
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white rounded-xl p-6 text-center border border-blue-100 shadow-sm transform transition-transform hover:scale-105">
            <div className="text-4xl font-bold text-blue-500 mb-2">$100K</div>
            <div className="text-gray-600">Virtual Starting Capital</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center border border-blue-100 shadow-sm transform transition-transform hover:scale-105">
            <div className="text-4xl font-bold text-blue-500 mb-2">Real-Time</div>
            <div className="text-gray-600">Market Data Integration</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center border border-blue-100 shadow-sm transform transition-transform hover:scale-105">
            <div className="text-4xl font-bold text-blue-500 mb-2">Zero Risk</div>
            <div className="text-gray-600">Practice Environment</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need to Learn</h2>
          <p className="text-xl text-gray-600">Comprehensive tools for beginners and experienced traders</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer hover:scale-105"
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className={`w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4 transition-colors ${hoveredFeature === index ? 'bg-blue-500' : ''}`}>
                  <Icon className={`w-6 h-6 transition-colors ${hoveredFeature === index ? 'text-white' : 'text-blue-500'}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Learning Path Section */}
      <section id="learn" className="bg-white py-20 relative overflow-hidden">
        {/* Animated background circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute w-96 h-96 bg-blue-100 rounded-full opacity-20"
            style={{ 
              top: '10%', 
              left: '-10%',
              transform: `translate(${scrollY * 0.05}px, ${scrollY * 0.03}px)`
            }}
          />
          <div 
            className="absolute w-64 h-64 bg-blue-200 rounded-full opacity-20"
            style={{ 
              bottom: '20%', 
              right: '-5%',
              transform: `translate(${-scrollY * 0.04}px, ${scrollY * 0.02}px)`
            }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Your Learning Journey</h2>
            <p className="text-xl text-gray-600">Structured path from beginner to expert trader</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((step) => {
              const stepOpacity = Math.min(Math.max((scrollY - 1200 - step * 100) / 300, 0), 1);
              const stepData = [
                { title: "Learn Fundamentals", desc: "Watch curated videos and complete interactive lessons" },
                { title: "Practice Trading", desc: "Apply your knowledge with virtual money in real market conditions" },
                { title: "Master Strategies", desc: "Backtest, compete, and refine your trading approach" }
              ];
              
              return (
                <div 
                  key={step}
                  className="text-center transition-all duration-500"
                  style={{ 
                    opacity: stepOpacity,
                    transform: `translateY(${Math.max(0, 30 - stepOpacity * 30)}px) scale(${0.9 + stepOpacity * 0.1})`
                  }}
                >
                  <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                    {step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{stepData[step - 1].title}</h3>
                  <p className="text-gray-600">{stepData[step - 1].desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-linear-to-r from-blue-500 to-blue-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Trading Journey?</h2>
          <p className="text-xl mb-8 text-blue-100">Join thousands learning to trade with confidence</p>
          <Link href="/login"><button className="px-8 py-3 bg-white text-blue-500 rounded-lg hover:bg-blue-50 transition text-lg font-medium">
            Create Free Account
          </button></Link>
        </div>
      </section>

      
    </div>
    </>
  );
}
