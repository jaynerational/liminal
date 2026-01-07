import { useEffect, useRef, useCallback } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
    color: string;
}

interface ParticleExplosionProps {
    trigger: boolean;
    x: number;
    y: number;
    color?: string;
    onComplete?: () => void;
}

export function ParticleExplosion({
    trigger,
    x,
    y,
    color = '#C47070',
    onComplete,
}: ParticleExplosionProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animationRef = useRef<number | null>(null);

    const createParticles = useCallback(() => {
        const particles: Particle[] = [];
        const particleCount = 60;

        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
            const speed = 2 + Math.random() * 4;

            particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                maxLife: 1,
                size: 2 + Math.random() * 4,
                color,
            });
        }

        return particles;
    }, [x, y, color]);

    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let hasActiveParticles = false;

        particlesRef.current.forEach((particle) => {
            if (particle.life <= 0) return;

            hasActiveParticles = true;

            // Update
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.1; // Gravity
            particle.vx *= 0.98; // Friction
            particle.vy *= 0.98;
            particle.life -= 0.02;

            // Draw
            const alpha = particle.life / particle.maxLife;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
            ctx.fillStyle = particle.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
            ctx.fill();
        });

        if (hasActiveParticles) {
            animationRef.current = requestAnimationFrame(animate);
        } else {
            onComplete?.();
        }
    }, [onComplete]);

    useEffect(() => {
        if (!trigger) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        particlesRef.current = createParticles();
        animate();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [trigger, createParticles, animate]);

    if (!trigger) return null;

    return (
        <canvas
            ref={canvasRef}
            className="particle-canvas"
        />
    );
}
