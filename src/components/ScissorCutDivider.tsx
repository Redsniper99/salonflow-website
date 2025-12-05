'use client';

import { useEffect, useRef, useState } from 'react';

interface ScissorCutDividerProps {
    direction?: 'left' | 'right';
}

export default function ScissorCutDivider({ direction = 'right' }: ScissorCutDividerProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [hasAnimated, setHasAnimated] = useState(false);
    const dividerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const divider = dividerRef.current;
        if (!divider) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimated) {
                        setIsVisible(true);
                        setHasAnimated(true);

                        // Play scissor sound
                        try {
                            const audio = new Audio('/sounds/scissor-cut.mp3');
                            audio.volume = 0.3;
                            audio.play().catch(() => { });
                        } catch (e) {
                            // Ignore audio errors
                        }
                    }
                });
            },
            { threshold: 0.3 }
        );

        observer.observe(divider);
        return () => observer.disconnect();
    }, [hasAnimated]);

    return (
        <div
            ref={dividerRef}
            className="relative py-12 overflow-hidden"
            style={{ minHeight: '100px' }}
        >
            {/* Cut line */}
            <div
                className={`absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 transition-transform duration-1000 ease-out ${isVisible ? 'scale-x-100' : 'scale-x-0'
                    }`}
                style={{
                    background: 'linear-gradient(90deg, transparent 0%, #7a9b6f 20%, #5d6c55 50%, #7a9b6f 80%, transparent 100%)',
                    boxShadow: '0 0 20px rgba(122, 155, 111, 0.6)',
                    transformOrigin: direction === 'right' ? 'left' : 'right',
                }}
            />

            {/* Animated scissor using CSS */}
            <div
                className={`absolute top-1/2 -translate-y-1/2 z-20 transition-all duration-1000 ease-in-out ${isVisible
                        ? (direction === 'right' ? 'translate-x-[100vw]' : '-translate-x-full')
                        : (direction === 'right' ? '-translate-x-full' : 'translate-x-[100vw]')
                    }`}
                style={{
                    left: 0,
                    transform: `translateY(-50%) ${isVisible
                        ? (direction === 'right' ? 'translateX(100vw) rotate(10deg)' : 'translateX(-100px) rotate(170deg)')
                        : (direction === 'right' ? 'translateX(-100px) rotate(-10deg)' : 'translateX(100vw) rotate(190deg)')
                        }`,
                }}
            >
                {/* Scissors SVG */}
                <svg
                    viewBox="0 0 120 80"
                    className="w-16 h-12 md:w-24 md:h-16"
                    style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))' }}
                >
                    <defs>
                        <linearGradient id={`grad-${direction}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#9bb88f" />
                            <stop offset="50%" stopColor="#7a9b6f" />
                            <stop offset="100%" stopColor="#4B5945" />
                        </linearGradient>
                    </defs>

                    {/* Top Blade */}
                    <path
                        d="M15 28 Q30 38 105 40 L105 42 Q30 40 15 30 Z"
                        fill={`url(#grad-${direction})`}
                    />

                    {/* Bottom Blade */}
                    <path
                        d="M15 52 Q30 42 105 40 L105 38 Q30 40 15 50 Z"
                        fill={`url(#grad-${direction})`}
                    />

                    {/* Top Handle */}
                    <ellipse cx="15" cy="22" rx="10" ry="12"
                        stroke={`url(#grad-${direction})`}
                        strokeWidth="4"
                        fill="none"
                    />

                    {/* Bottom Handle */}
                    <ellipse cx="15" cy="58" rx="10" ry="12"
                        stroke={`url(#grad-${direction})`}
                        strokeWidth="4"
                        fill="none"
                    />

                    {/* Pivot */}
                    <circle cx="30" cy="40" r="5" fill="#4B5945" />
                    <circle cx="30" cy="40" r="2.5" fill="#9bb88f" />
                </svg>
            </div>
        </div>
    );
}
