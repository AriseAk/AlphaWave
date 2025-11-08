"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { TrendingUp, Search, BookOpen, MessageCircle, Mail, Phone, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function HelpPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedFaq, setExpandedFaq] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [hoveredLink, setHoveredLink] = useState(null);
    const [hoveredContact, setHoveredContact] = useState(null);

    const sparkles = useMemo(() => {
        return Array.from({ length: 20 }, (_, i) => ({
            id: i,
            top: Math.random() * 100,
            left: Math.random() * 100,
            duration: 3 + Math.random() * 4,
            delay: Math.random() * 2
        }));
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const faqs = [
        {
            question: "How do I start trading with virtual money?",
            answer: "After signing up, you'll automatically receive $100,000 in virtual currency. Navigate to the trading dashboard and start practicing with real-time market data without any financial risk."
        },
        {
            question: "Is the market data real-time?",
            answer: "Yes! We integrate with live market data feeds to provide you with real-time stock prices, news, and market movements so you can practice trading in realistic conditions."
        },
        {
            question: "Can I compete with my friends?",
            answer: "Absolutely! You can create custom trading competitions with friends, set rules, time limits, and see who can generate the best returns. Navigate to the Social Trading section to get started."
        },
        {
            question: "How does the learning roadmap work?",
            answer: "Our learning roadmap is structured into beginner, intermediate, and advanced modules. Each module includes video lessons, reading materials, and interactive challenges. Complete challenges to earn virtual currency."
        },
        {
            question: "What is backtesting?",
            answer: "Backtesting allows you to test your trading strategies against historical market data. You can see how your strategy would have performed during different market conditions, including major events like the 2008 crash or COVID-19."
        },
        {
            question: "How do I reset my portfolio?",
            answer: "You can reset your portfolio at any time from your account settings. This will restore your virtual balance to $100,000 and clear all your trading history if you want to start fresh."
        }
    ];

    const quickLinks = [
        { title: "Getting Started Guide", icon: BookOpen, color: "from-blue-400 to-blue-600" },
        { title: "Trading Basics", icon: BookOpen, color: "from-purple-400 to-purple-600" },
        { title: "Understanding Charts", icon: BookOpen, color: "from-pink-400 to-pink-600" },
        { title: "Risk Management", icon: BookOpen, color: "from-orange-400 to-orange-600" },
        { title: "Platform Features", icon: BookOpen, color: "from-green-400 to-green-600" },
        { title: "Account Settings", icon: BookOpen, color: "from-indigo-400 to-indigo-600" }
    ];

    const contactOptions = [
        {
            icon: MessageCircle,
            title: "Live Chat",
            description: "Chat with our support team in real-time",
            action: "Start Chat",
            color: "from-blue-500 to-blue-600",
            delay: "0ms"
        },
        {
            icon: Mail,
            title: "Email Support",
            description: "We'll respond within 24 hours",
            action: "Send Email",
            color: "from-purple-500 to-purple-600",
            delay: "100ms"
        },
        {
            icon: Phone,
            title: "Phone Support",
            description: "Available Mon-Fri, 9am-5pm EST",
            action: "Call Us",
            color: "from-pink-500 to-pink-600",
            delay: "200ms"
        }
    ];

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
            {/* Animated background linear orbs */}
            <div
                className="absolute w-96 h-96 bg-blue-400 rounded-full opacity-20 blur-3xl transition-transform duration-1000"
                style={{
                    top: '10%',
                    left: '5%',
                    transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
                }}
            />
            <div
                className="absolute w-96 h-96 bg-purple-400 rounded-full opacity-20 blur-3xl transition-transform duration-1000"
                style={{
                    bottom: '10%',
                    right: '5%',
                    transform: `translate(${-mousePosition.x * 0.015}px, ${-mousePosition.y * 0.015}px)`
                }}
            />
            <div
                className="absolute w-64 h-64 bg-pink-400 rounded-full opacity-20 blur-3xl transition-transform duration-1000"
                style={{
                    top: '50%',
                    left: '50%',
                    transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`
                }}
            />

            {/* Navigation */}
            <nav className="bg-white bg-opacity-80 backdrop-blur-lg border-b border-blue-100 sticky top-0 z-50 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center space-x-2 hover:opacity-90">
                            <TrendingUp className="w-8 h-8 text-blue-500" />
                            <span className="text-2xl font-semibold text-gray-800">AlphaWave</span>
                        </Link>
                        <Link href="/" className="text-gray-600 hover:text-blue-500 transition-all duration-300 hover:scale-105">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-20 relative overflow-hidden">
                {/* Animated sparkles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {sparkles.map((sparkle) => (
                        <Sparkles
                            key={sparkle.id}
                            className="absolute text-white opacity-30"
                            style={{
                                top: `${sparkle.top}%`,
                                left: `${sparkle.left}%`,
                                animation: `float ${sparkle.duration}s ease-in-out infinite`,
                                animationDelay: `${sparkle.delay}s`
                            }}
                        />
                    ))}
                </div>

                <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
                        How can we help you?
                    </h1>
                    <p className="text-xl text-blue-100 mb-10 animate-fade-in" style={{ animationDelay: '100ms' }}>
                        Search our knowledge base or browse categories below
                    </p>

                    {/* Search Bar with enhanced animations */}
                    <div className="max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '200ms' }}>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <Search className={`h-6 w-6 transition-all duration-300 ${isSearchFocused ? 'text-blue-500 scale-110' : 'text-gray-400'}`} />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                                className="block w-full pl-14 pr-4 py-5 border-0 rounded-2xl text-gray-900 placeholder-gray-500 focus:ring-4 focus:ring-blue-300 shadow-2xl transition-all duration-300 transform hover:scale-105"
                                placeholder="Search for help articles, guides, or tutorials..."
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Links with staggered animations */}
            <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {quickLinks.map((link, index) => {
                        const Icon = link.icon;
                        return (
                            <button
                                key={index}
                                className="bg-white rounded-2xl p-6 border border-blue-100 hover:border-transparent hover:shadow-2xl transition-all duration-500 text-left transform hover:scale-105 hover:-translate-y-2 animate-fade-in"
                                style={{ animationDelay: `${index * 100}ms` }}
                                onMouseEnter={() => setHoveredLink(index)}
                                onMouseLeave={() => setHoveredLink(null)}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className={`w-12 h-12 bg-linear-to-br ${link.color} rounded-xl flex items-center justify-center transform transition-all duration-500 ${hoveredLink === index ? 'rotate-12 scale-110' : ''}`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <span className={`font-medium text-gray-900 transition-all duration-300 ${hoveredLink === index ? 'translate-x-2' : ''}`}>
                                        {link.title}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* FAQ Section */}
            <div className="max-w-4xl mx-auto px-6 py-20">
                <div className="text-center mb-16 animate-fade-in">
                    <h2 className="text-4xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h2>
                    <p className="text-gray-600 text-lg">Find answers to common questions about TradeSim</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl border border-blue-100 overflow-hidden transition-all duration-500 hover:shadow-lg animate-fade-in"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <button
                                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                className="w-full px-8 py-6 flex items-center justify-between hover:bg-linear-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
                            >
                                <span className="font-semibold text-gray-900 text-left text-lg">{faq.question}</span>
                                <div className={`transform transition-all duration-500 ${expandedFaq === index ? 'rotate-180' : ''}`}>
                                    <ChevronDown className="w-6 h-6 text-blue-500" />
                                </div>
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-500 ${expandedFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <div className="px-8 py-6 bg-linear-to-r from-blue-50 to-purple-50 border-t border-blue-100">
                                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact Support */}
            <div className="bg-white bg-opacity-80 backdrop-blur-sm border-t border-blue-100 py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16 animate-fade-in">
                        <h2 className="text-4xl font-bold text-gray-900 mb-3">Still need help?</h2>
                        <p className="text-gray-600 text-lg">Our support team is here for you</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {contactOptions.map((option, index) => {
                            const Icon = option.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl p-8 border border-blue-100 text-center transition-all duration-500 transform hover:scale-105 hover:shadow-2xl cursor-pointer animate-fade-in"
                                    style={{ animationDelay: option.delay }}
                                    onMouseEnter={() => setHoveredContact(index)}
                                    onMouseLeave={() => setHoveredContact(null)}
                                >
                                    <div className={`w-20 h-20 bg-linear-to-br ${option.color} rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-500 transform ${hoveredContact === index ? 'scale-110 rotate-12' : ''}`}>
                                        <Icon className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-semibold text-gray-900 mb-3">{option.title}</h3>
                                    <p className="text-gray-600 mb-6">{option.description}</p>
                                    <button className={`text-lg font-medium transition-all duration-300 transform ${hoveredContact === index ? 'scale-110' : ''}`}
                                        style={{
                                            background: `linear-linear(135deg, ${option.color.replace('from-', '').replace('to-', ', ')})`,
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text'
                                        }}
                                    >
                                        {option.action} →
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
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