"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { TrendingUp, Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // ✅ import router

export default function LoginPage() {
  const router = useRouter(); // ✅ initialize router
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [hoveredSocial, setHoveredSocial] = useState(null);

  const sparkles = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 2,
      size: 10 + Math.random() * 20
    })), []
  );

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Optionally validate email/password here
    if (email && password) {
      console.log('Login attempt:', { email, password });

      // ✅ Redirect user to Invest page
      router.push('/invest');
    } else {
      alert('Please enter your email and password');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-500 via-purple-500 to-pink-500 flex flex-col relative overflow-hidden">
      {/* Background & Nav code remains unchanged */}
      <nav className="bg-white bg-opacity-80 backdrop-blur-lg border-b border-blue-100 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-90">
            <TrendingUp className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-semibold text-gray-800">AlphaWave</span>
          </Link>
          <Link href="/" className="text-gray-600 hover:text-blue-500 transition-all duration-300 hover:scale-105">
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Login form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        <form
          onSubmit={handleSubmit}
          className="max-w-md w-full bg-white bg-opacity-95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white border-opacity-50 p-8"
        >
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-linear-to-br from-blue-500 to-purple-500 rounded-2xl mb-4">
              <TrendingUp className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to continue your trading journey</p>
          </div>

          {/* Email input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-300"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-300"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-blue-500" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-blue-500" />
                )}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-4 rounded-xl hover:shadow-2xl transition-all duration-500 font-medium text-lg transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden group"
          >
            <span className="relative z-10">Sign In</span>
            <div className="absolute inset-0 bg-linear-to-r from-pink-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </button>
        </form>
      </div>
    </div>
  );
}
