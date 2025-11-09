'use client';

import React, { useState } from 'react';
import { TrendingUp, Brain, BarChart3, TrendingDown, AlertCircle, CheckCircle, XCircle, Sparkles, LogOut, ArrowRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

export default function ModelDashboard() {
  const [isPredicting, setIsPredicting] = useState(false);
  const [showPrediction, setShowPrediction] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/';
  };

  const handlePredict = () => {
    setIsPredicting(true);
    setTimeout(() => {
      setIsPredicting(false);
      setShowPrediction(true);
    }, 2000);
  };

  // Model 1: News Sentiment Analysis
  const newsAnalysis = {
    sentiment: 'Positive',
    confidence: 87.5,
    category: 'Market Rally',
    headline: 'Tech Stocks Surge on Strong Earnings Reports',
    analysis: 'The market shows strong positive sentiment with major tech companies reporting better-than-expected quarterly earnings.',
  };

  // Model 2: Historical and Predicted Stock Data
  const historicalData = [
    { date: 'Jan', price: 150 },
    { date: 'Feb', price: 155 },
    { date: 'Mar', price: 148 },
    { date: 'Apr', price: 162 },
    { date: 'May', price: 158 },
    { date: 'Jun', price: 165 },
    { date: 'Jul', price: 172 },
  ];

  const predictedData = showPrediction ? [
    { date: 'Jul', price: 172 },
    { date: 'Aug', price: 178, predicted: true },
    { date: 'Sep', price: 182, predicted: true },
    { date: 'Oct', price: 185, predicted: true },
    { date: 'Nov', price: 188, predicted: true },
    { date: 'Dec', price: 192, predicted: true },
  ] : [];

  const combinedData = [...historicalData, ...predictedData.slice(1)];

  // Model 3: Sentiment Score
  const sentimentScores = {
    overall: 78,
    bullish: 72,
    neutral: 18,
    bearish: 10,
    socialMedia: 85,
    newsMedia: 74,
    analystReports: 76,
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
      case 'bullish':
        return 'text-green-600';
      case 'neutral':
        return 'text-yellow-600';
      case 'negative':
      case 'bearish':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
      case 'bullish':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'neutral':
        return <AlertCircle className="w-8 h-8 text-yellow-500" />;
      case 'negative':
      case 'bearish':
        return <XCircle className="w-8 h-8 text-red-500" />;
      default:
        return <AlertCircle className="w-8 h-8 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-300 rounded-full opacity-20 blur-3xl animate-float" style={{ top: '10%', left: '5%', animationDelay: '0s' }} />
        <div className="absolute w-80 h-80 bg-purple-300 rounded-full opacity-20 blur-3xl animate-float" style={{ bottom: '10%', right: '10%', animationDelay: '2s' }} />
        <div className="absolute w-64 h-64 bg-pink-300 rounded-full opacity-20 blur-3xl animate-float" style={{ top: '50%', left: '50%', animationDelay: '1s' }} />
      </div>

      {/* Navigation */}
      <nav className="bg-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-8 h-8 text-blue-500" />
              <span className="text-2xl font-semibold text-gray-800">AlphaWave</span>
            </div>
            <Link href="/" className="text-gray-600 hover:text-blue-500 transition">
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-4 relative z-10">
        {/* Header */}
        <div className="mb-4 animate-fade-in">
          <h1 className="text-2xl font-bold text-gray-900 mb-3 flex items-center">
            AI Market Analysis
            <Sparkles className="ml-2 w-5 h-5 text-yellow-500 animate-pulse" />
          </h1>
          <p className="text-sm text-gray-600">Real-time market sentiment and predictions powered by AI</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: Model 1 - News Sentiment Analysis */}
          <div className="lg:col-span-4 animate-fade-in">
            <div className="bg-white bg-opacity-90 backdrop-blur-xl rounded-xl border border-blue-100 shadow-lg h-full">
              <div className="p-4 border-b border-blue-100 bg-linear-to-r from-blue-500 to-purple-500 rounded-t-xl">
                <div className="flex items-center space-x-2 text-white">
                  <Brain className="w-5 h-5" />
                  <h2 className="text-lg font-bold">Model 1: News Sentiment</h2>
                </div>
              </div>
              
              <div className="p-4 space-y-4">
                {/* Sentiment Badge */}
                <div className="bg-linear-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    {getSentimentIcon(newsAnalysis.sentiment)}
                    <div className="text-right">
                      <p className="text-xs text-gray-600 mb-1">Confidence</p>
                      <p className="text-2xl font-bold text-gray-900">{newsAnalysis.confidence}%</p>
                    </div>
                  </div>
                  <h3 className={`text-2xl font-bold ${getSentimentColor(newsAnalysis.sentiment)} mb-1`}>
                    {newsAnalysis.sentiment}
                  </h3>
                  <p className="text-sm text-gray-600">{newsAnalysis.category}</p>
                </div>

                {/* Latest News */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Latest Analysis</h4>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <p className="text-sm font-medium text-gray-900">{newsAnalysis.headline}</p>
                    <p className="text-xs text-gray-600 leading-relaxed">{newsAnalysis.analysis}</p>
                  </div>
                </div>

                {/* Key Metrics */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                      <span className="text-xs text-gray-600">Positive News</span>
                      <span className="text-xs font-semibold text-green-600">67%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                      <span className="text-xs text-gray-600">Neutral News</span>
                      <span className="text-xs font-semibold text-yellow-600">23%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                      <span className="text-xs text-gray-600">Negative News</span>
                      <span className="text-xs font-semibold text-red-600">10%</span>
                    </div>
                  </div>
                </div>

                {/* Update Info */}
                <div className="text-center pt-2">
                  <p className="text-xs text-gray-500">Last updated: 2 minutes ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Middle: Model 2 - Price Prediction Graph */}
          <div className="lg:col-span-5 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="bg-white bg-opacity-90 backdrop-blur-xl rounded-xl border border-blue-100 shadow-lg h-full">
              <div className="p-4 border-b border-blue-100 bg-linear-to-r from-purple-500 to-pink-500 rounded-t-xl">
                <div className="flex items-center space-x-2 text-white">
                  <BarChart3 className="w-5 h-5" />
                  <h2 className="text-lg font-bold">Model 2: Price Prediction</h2>
                </div>
              </div>
              
              <div className="p-4 space-y-4">
                {/* Chart */}
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={combinedData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                        domain={['dataMin - 5', 'dataMax + 5']}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                      <Legend 
                        wrapperStyle={{ fontSize: '12px' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        name="Historical"
                        dot={{ fill: '#3b82f6', r: 4 }}
                      />
                      {showPrediction && (
                        <Line 
                          type="monotone" 
                          dataKey="price" 
                          stroke="#a855f7" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          name="Predicted"
                          dot={{ fill: '#a855f7', r: 4 }}
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Prediction Stats */}
                {showPrediction && (
                  <div className="grid grid-cols-3 gap-2 animate-fade-in">
                    <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg p-3 text-center border border-blue-200">
                      <p className="text-xs text-gray-600 mb-1">Current</p>
                      <p className="text-lg font-bold text-gray-900">$172</p>
                    </div>
                    <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-lg p-3 text-center border border-purple-200">
                      <p className="text-xs text-gray-600 mb-1">Predicted</p>
                      <p className="text-lg font-bold text-purple-600">$192</p>
                    </div>
                    <div className="bg-linear-to-br from-green-50 to-green-100 rounded-lg p-3 text-center border border-green-200">
                      <p className="text-xs text-gray-600 mb-1">Change</p>
                      <p className="text-lg font-bold text-green-600">+11.6%</p>
                    </div>
                  </div>
                )}

                {/* Predict Button */}
                <button
                  onClick={handlePredict}
                  disabled={isPredicting || showPrediction}
                  className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 transition-all duration-300 ${
                    showPrediction
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : isPredicting
                      ? 'bg-linear-to-r from-purple-400 to-pink-400 text-white cursor-wait'
                      : 'bg-linear-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg transform hover:scale-105'
                  }`}
                >
                  {isPredicting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Predicting...</span>
                    </>
                  ) : showPrediction ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Prediction Complete</span>
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4" />
                      <span>Generate Prediction</span>
                    </>
                  )}
                </button>

                {showPrediction && (
                  <button
                    onClick={() => setShowPrediction(false)}
                    className="w-full py-2 rounded-lg border-2 border-gray-300 text-gray-600 hover:bg-gray-50 font-medium text-sm transition-all duration-300"
                  >
                    Reset
                  </button>
                )}

                {/* Model Info */}
                <div className="text-center pt-2">
                  <p className="text-xs text-gray-500">Prediction accuracy: 87.3%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Model 3 - Sentiment Score */}
          <div className="lg:col-span-3 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="bg-white bg-opacity-90 backdrop-blur-xl rounded-xl border border-blue-100 shadow-lg h-full">
              <div className="p-4 border-b border-blue-100 bg-linear-to-r from-pink-500 to-red-500 rounded-t-xl">
                <div className="flex items-center space-x-2 text-white">
                  <TrendingUp className="w-5 h-5" />
                  <h2 className="text-lg font-bold">Model 3: Sentiment Score</h2>
                </div>
              </div>
              
              <div className="p-4 space-y-4">
                {/* Overall Score */}
                <div className="bg-linear-to-br from-blue-50 to-purple-50 rounded-xl p-4 border-2 border-blue-200 text-center">
                  <p className="text-sm text-gray-600 mb-2">Overall Sentiment</p>
                  <div className="relative w-32 h-32 mx-auto mb-2">
                    <svg className="transform -rotate-90 w-32 h-32">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="url(#linear)"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - sentimentScores.overall / 100)}`}
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearlinear id="linear" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearlinear>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-gray-900">{sentimentScores.overall}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">Bullish Sentiment</p>
                </div>

                {/* Market Sentiment Breakdown */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Market Sentiment</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-600">Bullish</span>
                        <span className="text-xs font-semibold text-green-600">{sentimentScores.bullish}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-linear-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${sentimentScores.bullish}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-600">Neutral</span>
                        <span className="text-xs font-semibold text-yellow-600">{sentimentScores.neutral}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-linear-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${sentimentScores.neutral}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-600">Bearish</span>
                        <span className="text-xs font-semibold text-red-600">{sentimentScores.bearish}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-linear-to-r from-red-400 to-red-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${sentimentScores.bearish}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Source Analysis */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Source Analysis</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                      <span className="text-xs text-gray-600">Social Media</span>
                      <span className="text-xs font-semibold text-blue-600">{sentimentScores.socialMedia}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-purple-50 rounded-lg">
                      <span className="text-xs text-gray-600">News Media</span>
                      <span className="text-xs font-semibold text-purple-600">{sentimentScores.newsMedia}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-pink-50 rounded-lg">
                      <span className="text-xs text-gray-600">Analyst Reports</span>
                      <span className="text-xs font-semibold text-pink-600">{sentimentScores.analystReports}</span>
                    </div>
                  </div>
                </div>

                {/* Update Info */}
                <div className="text-center pt-2">
                  <p className="text-xs text-gray-500">Updated in real-time</p>
                </div>
              </div>
            </div>
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
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}