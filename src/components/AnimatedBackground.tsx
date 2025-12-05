'use client';

import { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Particle class for floating bubbles/orbs
        class Particle {
            x: number;
            y: number;
            size: number;
            speedY: number;
            speedX: number;
            opacity: number;

            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 100 + 50;
                this.speedY = Math.random() * 0.5 + 0.2;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.15 + 0.05;
            }

            update() {
                this.y -= this.speedY;
                this.x += this.speedX;

                // Reset particle when it goes off screen
                if (this.y + this.size < 0) {
                    this.y = canvas.height + this.size;
                    this.x = Math.random() * canvas.width;
                }
                if (this.x > canvas.width + this.size) {
                    this.x = -this.size;
                }
                if (this.x < -this.size) {
                    this.x = canvas.width + this.size;
                }
            }

            draw() {
                if (!ctx) return;

                // Create radial gradient for glow effect
                const gradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, this.size
                );
                gradient.addColorStop(0, `rgba(122, 155, 111, ${this.opacity})`); // salon-accent
                gradient.addColorStop(0.5, `rgba(93, 108, 85, ${this.opacity * 0.5})`); // salon-green-light
                gradient.addColorStop(1, 'rgba(75, 89, 69, 0)'); // salon-green transparent

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Create particles
        const particles: Particle[] = [];
        const particleCount = 20;

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Animation loop
        let animationId: number;
        const animate = () => {
            if (!ctx) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <div className="fixed inset-0 w-full h-full -z-50 overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-salon-neutral-900 via-salon-green-dark to-black animate-gradient"></div>

            {/* Canvas for floating particles */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full opacity-80"
            />

            {/* Subtle overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"></div>
        </div>
    );
}
