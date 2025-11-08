"use client"

import React, { useState } from 'react';
import { TrendingUp, Edit2, Save, X, DollarSign, PieChart, Award, Calendar, Mail, Phone, MapPin, Sparkles, LogOut, Activity , User } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [userName, setUserName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [tempName, setTempName] = useState(userName);
  const [tempEmail, setTempEmail] = useState(email);
  const [tempPhone, setTempPhone] = useState(phone);

  const handleSaveName = () => {
    setUserName(tempName);
    setIsEditingName(false);
  };

  const handleCancelName = () => {
    setTempName(userName);
    setIsEditingName(false);
  };

  const handleSaveEmail = () => {
    setEmail(tempEmail);
    setIsEditingEmail(false);
  };

  const handleCancelEmail = () => {
    setTempEmail(email);
    setIsEditingEmail(false);
  };

  const handleSavePhone = () => {
    setPhone(tempPhone);
    setIsEditingPhone(false);
  };

  const handleCancelPhone = () => {
    setTempPhone(phone);
    setIsEditingPhone(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/';
  };

  const accountStats = [
    { label: 'Portfolio Value', value: '$125,340.50', change: '+25.34%', icon: DollarSign, color: 'from-blue-500 to-blue-600' },
    { label: 'Total Invested', value: '$100,000.00', change: 'Principal', icon: PieChart, color: 'from-green-500 to-green-600' },
    { label: 'Total Return', value: '$25,340.50', change: '+25.34%', icon: Activity, color: 'from-purple-500 to-purple-600' },
    { label: 'Buying Power', value: '$74,659.50', change: 'Available', icon: Award, color: 'from-pink-500 to-pink-600' },
  ];

  const recentActivity = [
    { action: 'Bought', symbol: 'AAPL', shares: 10, price: '$178.50', date: '2 hours ago' },
    { action: 'Sold', symbol: 'TSLA', shares: 5, price: '$240.20', date: '5 hours ago' },
    { action: 'Bought', symbol: 'GOOGL', shares: 15, price: '$140.50', date: '1 day ago' },
    { action: 'Dividend', symbol: 'MSFT', shares: '-', price: '$45.20', date: '2 days ago' },
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
              <Link href="/invest"><button className="text-gray-600 hover:text-blue-500 transition-all duration-300 hover:scale-110 text-sm">Portfolio</button></Link>
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
        {/* Header */}
        <div className="mb-4 animate-fade-in">
          <h1 className="text-2xl font-bold text-gray-900 mb-3 flex items-center">
            My Profile
            <Sparkles className="ml-2 w-5 h-5 text-yellow-500 animate-pulse" />
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-4">
            {/* Profile Card */}
            <div className="bg-white bg-opacity-90 backdrop-blur-xl rounded-xl border border-blue-100 shadow-lg p-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-3xl mb-4 shadow-lg">
                  JD
                </div>
                
                {/* Name Edit */}
                <div className="w-full mb-4">
                  {isEditingName ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg text-center text-lg font-semibold focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveName}
                          className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center text-sm"
                        >
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </button>
                        <button
                          onClick={handleCancelName}
                          className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors flex items-center justify-center text-sm"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <h2 className="text-xl font-bold text-gray-900">{userName}</h2>
                      <button
                        onClick={() => setIsEditingName(true)}
                        className="text-blue-500 hover:text-blue-600 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="w-full space-y-2 text-sm">
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                    <span className="text-gray-600 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Member Since
                    </span>
                    <span className="font-semibold text-gray-900">Jan 2024</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white bg-opacity-90 backdrop-blur-xl rounded-xl border border-blue-100 shadow-lg p-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Contact Information</h3>
              
              <div className="space-y-3">
                {/* Email */}
                <div>
                  {isEditingEmail ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          value={tempEmail}
                          onChange={(e) => setTempEmail(e.target.value)}
                          className="flex-1 px-3 py-1.5 border-2 border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={handleSaveEmail} className="flex-1 bg-green-500 text-white py-1.5 rounded-lg hover:bg-green-600 text-xs">
                          <Save className="w-3 h-3 inline mr-1" />Save
                        </button>
                        <button onClick={handleCancelEmail} className="flex-1 bg-gray-300 text-gray-700 py-1.5 rounded-lg hover:bg-gray-400 text-xs">
                          <X className="w-3 h-3 inline mr-1" />Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{email}</span>
                      </div>
                      <button onClick={() => setIsEditingEmail(true)} className="text-blue-500 hover:text-blue-600">
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div>
                  {isEditingPhone ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          value={tempPhone}
                          onChange={(e) => setTempPhone(e.target.value)}
                          className="flex-1 px-3 py-1.5 border-2 border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={handleSavePhone} className="flex-1 bg-green-500 text-white py-1.5 rounded-lg hover:bg-green-600 text-xs">
                          <Save className="w-3 h-3 inline mr-1" />Save
                        </button>
                        <button onClick={handleCancelPhone} className="flex-1 bg-gray-300 text-gray-700 py-1.5 rounded-lg hover:bg-gray-400 text-xs">
                          <X className="w-3 h-3 inline mr-1" />Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{phone}</span>
                      </div>
                      <button onClick={() => setIsEditingPhone(true)} className="text-blue-500 hover:text-blue-600">
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Location */}
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">San Francisco, CA</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="w-full bg-linear-to-r from-red-500 to-red-600 text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-medium flex items-center justify-center text-sm"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout from Account
            </button>
          </div>

          {/* Right Column - Account Stats & Activity */}
          <div className="lg:col-span-2 space-y-4">
            {/* Account Balance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {accountStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className={`bg-linear-to-br ${stat.color} rounded-xl p-4 text-white shadow-lg transform hover:scale-105 transition-all duration-500 animate-fade-in`}
                    style={{ animationDelay: `${(index + 3) * 100}ms` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-white text-opacity-80">{stat.label}</p>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                    <p className="text-xs text-white text-opacity-90">{stat.change}</p>
                  </div>
                );
              })}
            </div>

            {/* Recent Activity */}
            <div className="bg-white bg-opacity-90 backdrop-blur-xl rounded-xl border border-blue-100 shadow-lg animate-fade-in" style={{ animationDelay: '700ms' }}>
              <div className="p-4 border-b border-blue-100">
                <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
              </div>
              <div className="divide-y divide-blue-100">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="p-4 hover:bg-linear-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          activity.action === 'Bought' ? 'bg-green-100 text-green-600' :
                          activity.action === 'Sold' ? 'bg-red-100 text-red-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {activity.action === 'Bought' ? '↗' : activity.action === 'Sold' ? '↘' : '$'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {activity.action} {activity.symbol}
                          </p>
                          <p className="text-xs text-gray-500">
                            {activity.shares !== '-' ? `${activity.shares} shares at ${activity.price}` : activity.price}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{activity.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-white bg-opacity-90 backdrop-blur-xl rounded-xl border border-blue-100 shadow-lg p-4 animate-fade-in" style={{ animationDelay: '800ms' }}>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Account Settings</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm">
                  <span className="font-medium text-gray-900">Security & Privacy</span>
                  <p className="text-xs text-gray-500 mt-1">Change password, enable 2FA</p>
                </button>
                <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm">
                  <span className="font-medium text-gray-900">Notifications</span>
                  <p className="text-xs text-gray-500 mt-1">Manage email and push notifications</p>
                </button>
                <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm">
                  <span className="font-medium text-gray-900">Banking Information</span>
                  <p className="text-xs text-gray-500 mt-1">Link bank accounts for deposits</p>
                </button>
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
      `}</style>
    </div>
  );
}