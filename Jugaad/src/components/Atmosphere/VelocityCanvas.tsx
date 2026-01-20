import { useEffect, useRef, useCallback } from 'react';
import { createNoise2D } from 'simplex-noise';

interface VelocityCanvasProps {
    typingVelocity: number; // 0-1 normalized
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
}

const VelocityCanvas = ({ typingVelocity }: VelocityCanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const noiseRef = useRef(createNoise2D());
    const rafRef = useRef<number | null>(null);
    const timeRef = useRef(0);

    const spawnParticle = useCallback((width: number, height: number) => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 1.5;
        return {
            x: width / 2 + (Math.random() - 0.5) * 100,
            y: height / 2 + (Math.random() - 0.5) * 100,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1,
            maxLife: 60 + Math.random() * 60,
            size: 2 + Math.random() * 3,
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const animate = () => {
            timeRef.current += 0.01;
            const noise = noiseRef.current;

            // Spawn new particles based on velocity
            const spawnRate = Math.floor(typingVelocity * 5);
            for (let i = 0; i < spawnRate; i++) {
                if (particlesRef.current.length < 100) {
                    particlesRef.current.push(spawnParticle(canvas.width, canvas.height));
                }
            }

            // Clear with background fade
            ctx.fillStyle = 'rgba(253, 249, 246, 0.15)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Update & draw particles
            particlesRef.current = particlesRef.current.filter(p => {
                // Apply noise to velocity
                const n = noise(p.x * 0.01, p.y * 0.01 + timeRef.current);
                p.vx += n * 0.1;
                p.vy += noise(p.y * 0.01, p.x * 0.01 + timeRef.current) * 0.1;

                // Update position
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 1 / p.maxLife;

                // Draw
                const alpha = p.life * 0.6;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

                // Light theme particle colors (Rose and Lavender)
                const primary = '232, 164, 196';
                const secondary = '196, 176, 232';
                const color = Math.random() > 0.5 ? primary : secondary;

                ctx.fillStyle = `rgba(${color}, ${alpha})`;
                ctx.fill();

                return p.life > 0;
            });

            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resize);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [typingVelocity, spawnParticle]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 3,
            }}
        />
    );
};

export default VelocityCanvas;
