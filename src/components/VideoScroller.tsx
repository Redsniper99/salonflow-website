'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/utils/gsapConfig';

export default function VideoScroller() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Detect if device is mobile
        const checkMobile = () => {
            setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
        };
        checkMobile();
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Force video to load and be ready on mobile
        const initVideo = () => {
            video.load();
            // Attempt to play then immediately pause (iOS workaround)
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        video.pause();
                    })
                    .catch(() => {
                        // Autoplay failed, video will work with scroll anyway
                    });
            }
        };

        // Ensure video metadata is loaded before setting up animation
        const setupAnimation = () => {
            if (!video.duration) return;

            // Ensure video is paused
            video.pause();

            // Use a proxy object to decouple the tween from the video element
            const proxy = { currentTime: 0 };

            const ctx = gsap.context(() => {
                gsap.to(proxy, {
                    currentTime: video.duration,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: 'body',
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: isMobile ? 1 : 3, // Faster scrub on mobile for better responsiveness
                    },
                    onUpdate: () => {
                        // CRITICAL: Only seek if the video is not currently seeking
                        if (!video.seeking) {
                            // Use a larger threshold on mobile for better performance
                            const threshold = isMobile ? 0.2 : 0.1;
                            if (Math.abs(video.currentTime - proxy.currentTime) > threshold) {
                                video.currentTime = proxy.currentTime;
                            }
                        }
                    }
                });
            });

            return () => ctx.revert();
        };

        // Initialize video
        initVideo();

        if (video.readyState >= 1) {
            setupAnimation();
        } else {
            video.addEventListener('loadedmetadata', setupAnimation);
        }

        return () => {
            video.removeEventListener('loadedmetadata', setupAnimation);
        };
    }, [isMobile]);

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
                webkit-playsinline="true"
                x-webkit-airplay="allow"
                className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto object-cover transform -translate-x-1/2 -translate-y-1/2 opacity-60"
            />
            {/* Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
        </div>
    );
}
