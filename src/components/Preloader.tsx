'use client';

import { useState, useEffect, useMemo } from 'react';

interface PreloaderProps {
    onComplete: () => void;
}

// Fixed particle positions to avoid hydration mismatch
const particles = [
    { left: 10, top: 20, delay: 0, duration: 4 },
    { left: 25, top: 60, delay: 1, duration: 5 },
    { left: 40, top: 15, delay: 2, duration: 4.5 },
    { left: 55, top: 75, delay: 0.5, duration: 5.5 },
    { left: 70, top: 35, delay: 1.5, duration: 4 },
    { left: 85, top: 85, delay: 2.5, duration: 5 },
    { left: 15, top: 45, delay: 3, duration: 4.5 },
    { left: 60, top: 10, delay: 0.8, duration: 5.2 },
    { left: 90, top: 55, delay: 1.2, duration: 4.8 },
    { left: 35, top: 90, delay: 2.2, duration: 5.3 },
];

export default function Preloader({ onComplete }: PreloaderProps) {
    const [progress, setProgress] = useState(0);
    const [isExiting, setIsExiting] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setIsExiting(true);
                        setTimeout(onComplete, 800);
                    }, 400);
                    return 100;
                }
                return prev + 8;
            });
        }, 120);

        return () => clearInterval(interval);
    }, [onComplete]);

    if (!isMounted) {
        // Return a minimal loader during SSR to avoid hydration issues
        return (
            <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-primary-950 via-[#1a1f1a] to-primary-950 flex items-center justify-center">
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold gradient-text">SalonFlow</h1>
            </div>
        );
    }

    return (
        <div
            className={`fixed inset-0 z-[9999] bg-gradient-to-br from-primary-950 via-[#1a1f1a] to-primary-950 flex items-center justify-center transition-all duration-800 ${isExiting ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
                }`}
        >
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden">
                {particles.map((p, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-primary-400/30 rounded-full animate-float"
                        style={{
                            left: `${p.left}%`,
                            top: `${p.top}%`,
                            animationDelay: `${p.delay}s`,
                            animationDuration: `${p.duration}s`,
                        }}
                    />
                ))}
            </div>

            <div className="relative flex flex-col items-center">
                {/* Logo Container with Shine */}
                <div className="relative mb-8">
                    {/* Glow ring */}
                    <div className="absolute inset-0 -m-4 rounded-full border-2 border-primary-400/30 animate-pulse" />
                    <div className="absolute inset-0 -m-8 rounded-full border border-primary-400/10 animate-ping" style={{ animationDuration: '2s' }} />

                    {/* Logo Text */}
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold gradient-text relative z-10 tracking-tight">
                        SalonFlow
                    </h1>

                    {/* Shine overlay */}
                    <div className="absolute inset-0 -m-2 overflow-hidden rounded-lg">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine" />
                    </div>
                </div>

                {/* Animated Scissors */}
                <div className="relative w-32 h-16 mb-8">
                    {/* Cutting line */}
                    <div
                        className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-transparent via-primary-400 to-transparent -translate-y-1/2 transition-all duration-300"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    />

                    {/* Scissors SVG */}
                    <div
                        className="absolute top-1/2 transition-all duration-300"
                        style={{
                            left: `${Math.min(progress, 95)}%`,
                            transform: 'translateY(-50%) translateX(-50%)'
                        }}
                    >
                        <svg
                            viewBox="0 0 120 80"
                            className="w-14 h-10"
                            style={{ filter: 'drop-shadow(0 0 8px rgba(116, 150, 116, 0.5))' }}
                        >
                            <defs>
                                <linearGradient id="scissor-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#9cb89c" />
                                    <stop offset="50%" stopColor="#749674" />
                                    <stop offset="100%" stopColor="#567856" />
                                </linearGradient>
                            </defs>

                            {/* Top Blade */}
                            <path
                                d="M15 28 Q30 38 105 40 L105 42 Q30 40 15 30 Z"
                                fill="url(#scissor-grad)"
                            />

                            {/* Bottom Blade */}
                            <path
                                d="M15 52 Q30 42 105 40 L105 38 Q30 40 15 50 Z"
                                fill="url(#scissor-grad)"
                            />

                            {/* Top Handle */}
                            <ellipse cx="15" cy="22" rx="10" ry="12"
                                stroke="url(#scissor-grad)"
                                strokeWidth="4"
                                fill="none"
                            />

                            {/* Bottom Handle */}
                            <ellipse cx="15" cy="58" rx="10" ry="12"
                                stroke="url(#scissor-grad)"
                                strokeWidth="4"
                                fill="none"
                            />

                            {/* Pivot */}
                            <circle cx="30" cy="40" r="5" fill="#567856" />
                            <circle cx="30" cy="40" r="2.5" fill="#9cb89c" />
                        </svg>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="w-48 sm:w-64 h-1 bg-white/10 rounded-full overflow-hidden mb-4">
                    <div
                        className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-200"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                </div>

                {/* Loading text */}
                <p className="text-white/60 text-sm tracking-widest uppercase">
                    {progress < 100 ? 'Loading...' : 'Welcome'}
                </p>
            </div>

            {/* Corner decorations */}
            <div className="absolute top-6 left-6 w-16 h-16 border-l-2 border-t-2 border-primary-400/20 rounded-tl-2xl" />
            <div className="absolute top-6 right-6 w-16 h-16 border-r-2 border-t-2 border-primary-400/20 rounded-tr-2xl" />
            <div className="absolute bottom-6 left-6 w-16 h-16 border-l-2 border-b-2 border-primary-400/20 rounded-bl-2xl" />
            <div className="absolute bottom-6 right-6 w-16 h-16 border-r-2 border-b-2 border-primary-400/20 rounded-br-2xl" />
        </div>
    );
}
