"use client"

import React from 'react'
import { TrendingUp } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const Navbar = () => {

    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navBlur = Math.min(scrollY / 50, 10);

    return (
        <nav
            className="bg-white border-b border-blue-100 fixed top-0 w-full z-50 transition-all duration-300"
            style={{
                backdropFilter: `blur(${navBlur}px)`,
                backgroundColor: navBlur > 0 ? 'rgba(255, 255, 255, 0.9)' : 'white'
            }}
        >
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2 hover:opacity-90">
                        <TrendingUp className="w-8 h-8 text-blue-500" />
                        <span className="text-2xl font-semibold text-gray-800">AlphaWave</span>
                    </Link>
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="#features" className="text-gray-600 hover:text-blue-500 transition">Features</Link>
                        <Link href="/help" className="text-gray-600 hover:text-blue-500 transition">Learn</Link>
                        <Link href="/about" className="text-gray-600 hover:text-blue-500 transition">About</Link>
                        <Link href="/login"><button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                            Get Started
                        </button></Link>
                    </div>
                </div>
            </div>
        </nav>

    )
}

export default Navbar