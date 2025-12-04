'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/utils/gsapConfig';

export default function VideoScroller() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Ensure video metadata is loaded before setting up animation
        const setupAnimation = () => {
            if (!video.duration) return;

            // Ensure video is paused
            video.pause();

            // Use a proxy object to decouple the tween from the video element
            // This allows us to throttle updates if needed and prevents "fighting"
            const proxy = { currentTime: 0 };

            const ctx = gsap.context(() => {
                gsap.to(proxy, {
                    currentTime: video.duration,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: 'body',
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: 3, // Increased scrub for ultra-smooth playback
                    },
                    onUpdate: () => {
                        // CRITICAL: Only seek if the video is not currently seeking
                        // This prevents the "stuck" behavior when the decoder can't keep up
                        if (!video.seeking) {
                            // Use a small threshold to avoid micro-updates
                            if (Math.abs(video.currentTime - proxy.currentTime) > 0.1) {
                                video.currentTime = proxy.currentTime;
                            }
                        }
                    }
                });
            });

            return () => ctx.revert();
        };

        if (video.readyState >= 1) {
            setupAnimation();
        } else {
            video.addEventListener('loadedmetadata', setupAnimation);
        }

        return () => {
            video.removeEventListener('loadedmetadata', setupAnimation);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 w-full h-full -z-50 overflow-hidden bg-black"
        >
            <video
                ref={videoRef}
                src="/videos/bg.mp4"
                muted
                playsInline
                preload="auto"
                className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto object-cover transform -translate-x-1/2 -translate-y-1/2 opacity-60"
            />
            {/* Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
        </div>
    );
}
