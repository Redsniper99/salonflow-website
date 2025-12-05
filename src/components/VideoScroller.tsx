'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap, ScrollTrigger } from '@/utils/gsapConfig';

export default function VideoScroller() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [isVideoReady, setIsVideoReady] = useState(false);
    const rafRef = useRef<number | null>(null);
    const targetTimeRef = useRef(0);
    const currentTimeRef = useRef(0);
    const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
        };
        checkMobile();
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        let cleanup: (() => void) | undefined;

        // Smooth interpolation for video time
        const smoothSeek = () => {
            if (!video) return;

            const diff = targetTimeRef.current - currentTimeRef.current;
            const ease = isMobile ? 0.12 : 0.08;

            if (Math.abs(diff) > 0.01) {
                currentTimeRef.current += diff * ease;

                if (!video.seeking && Math.abs(video.currentTime - currentTimeRef.current) > 0.03) {
                    try {
                        video.currentTime = currentTimeRef.current;
                    } catch (e) {
                        // Ignore seek errors
                    }
                }
            }

            rafRef.current = requestAnimationFrame(smoothSeek);
        };

        // Initialize video
        const initVideo = () => {
            video.load();
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        video.pause();
                        video.currentTime = 0;
                        currentTimeRef.current = 0;
                        targetTimeRef.current = 0;
                        setIsVideoReady(true);
                    })
                    .catch(() => {
                        setIsVideoReady(true);
                    });
            }
        };

        const setupAnimation = () => {
            if (!video.duration) return;

            video.pause();
            video.currentTime = 0;

            // Start smooth seek loop
            rafRef.current = requestAnimationFrame(smoothSeek);

            // Create scroll trigger without pinning to avoid DOM conflicts
            scrollTriggerRef.current = ScrollTrigger.create({
                trigger: document.body,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0,
                onUpdate: (self) => {
                    targetTimeRef.current = self.progress * video.duration;
                }
            });

            cleanup = () => {
                if (scrollTriggerRef.current) {
                    scrollTriggerRef.current.kill();
                    scrollTriggerRef.current = null;
                }
                if (rafRef.current) {
                    cancelAnimationFrame(rafRef.current);
                    rafRef.current = null;
                }
            };
        };

        initVideo();

        if (video.readyState >= 1) {
            setupAnimation();
        } else {
            video.addEventListener('loadedmetadata', setupAnimation);
        }

        return () => {
            video.removeEventListener('loadedmetadata', setupAnimation);
            if (cleanup) cleanup();
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
            if (scrollTriggerRef.current) {
                scrollTriggerRef.current.kill();
            }
        };
    }, [isMobile]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 w-full h-full -z-10 overflow-hidden bg-primary-950"
            suppressHydrationWarning
        >
            {/* Loading state */}
            {!isVideoReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-primary-950">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-primary-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-white/60 text-sm">Loading...</p>
                    </div>
                </div>
            )}

            {/* Video Background */}
            <video
                ref={videoRef}
                src="/videos/bg.mp4"
                muted
                playsInline
                preload="auto"
                className={`absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto object-cover transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-1000 ${isVideoReady ? 'opacity-60' : 'opacity-0'}`}
                suppressHydrationWarning
            />

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none"></div>
        </div>
    );
}
