import { useEffect, useRef, useState, useCallback } from 'react';
import { db, Thought } from '../../db';
import { Emotion, emotionColors } from '../../utils/emotionDetector';
import { X, Sparkles, Square, Smartphone } from 'lucide-react';

interface ConstellationNode {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    emotion: Emotion;
    content: string;
    radius: number;
    pulsePhase: number;
    createdAt: number;
    numPetals: number;
}

interface GardenProps {
    onClose?: () => void;
}

const emotionCenters: Record<Emotion, { x: number; y: number }> = {
    joy: { x: 0.7, y: 0.2 },
    peace: { x: 0.5, y: 0.5 },
    melancholy: { x: 0.2, y: 0.7 },
    anxiety: { x: 0.8, y: 0.6 },
    anger: { x: 0.3, y: 0.3 },
    love: { x: 0.6, y: 0.4 },
    confusion: { x: 0.4, y: 0.8 },
};

const Garden = ({ onClose }: GardenProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [thoughts, setThoughts] = useState<Thought[]>([]);
    const nodesRef = useRef<ConstellationNode[]>([]);
    const animationRef = useRef<number>(0);
    const timeRef = useRef(0);

    // Load solidified thoughts
    useEffect(() => {
        const loadThoughts = async () => {
            const solidified = await db.thoughts
                .where('solidified')
                .equals(1)
                .toArray();
            console.log('Solidified thoughts loaded:', solidified.length);
            setThoughts(solidified);
        };
        loadThoughts();
    }, []);

    // Initialize nodes when thoughts load
    useEffect(() => {
        if (thoughts.length === 0) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const width = canvas.width = window.innerWidth;
        const height = canvas.height = window.innerHeight;
        const padding = Math.min(width, height) * 0.15;

        nodesRef.current = thoughts.map((t) => {
            const emotion = (t.emotion as Emotion) || 'peace';
            const center = emotionCenters[emotion];
            const spread = 0.15;
            // Petal count based on content length
            const numPetals = Math.max(5, Math.min(18, Math.floor(t.content.length / 8) + 5));

            return {
                id: t.id!,
                x: padding + (center.x + (Math.random() - 0.5) * spread) * (width - padding * 2),
                y: padding + (center.y + (Math.random() - 0.5) * spread) * (height - padding * 2),
                vx: 0,
                vy: 0,
                emotion,
                content: t.content,
                radius: 20 + Math.min(t.content.length / 10, 30),
                pulsePhase: Math.random() * Math.PI * 2,
                createdAt: t.createdAt,
                numPetals,
            };
        });
    }, [thoughts]);

    const drawFlower = (ctx: CanvasRenderingContext2D, node: ConstellationNode, time: number, colors: Record<Emotion, string>) => {
        const pulse = 1 + Math.sin(time * 2 + node.pulsePhase) * 0.08;
        const r = node.radius * pulse;
        const color = colors[node.emotion];
        const { x, y, emotion, numPetals } = node;

        ctx.save();
        ctx.translate(x, y);

        // Enhanced Luminous Glow
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 3.5);
        gradient.addColorStop(0, `${color}66`);   // Brighter core
        gradient.addColorStop(0.3, `${color}22`); // Soft falloff
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, r * 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Draw Petals
        ctx.fillStyle = color;
        ctx.strokeStyle = `${color}AA`;
        ctx.lineWidth = 1;

        for (let i = 0; i < numPetals; i++) {
            ctx.save();
            ctx.rotate((i * Math.PI * 2) / numPetals + time * 0.2);

            ctx.beginPath();
            ctx.moveTo(0, 0);

            // Shape variations per emotion
            switch (emotion) {
                case 'joy': // Radiance (Pointy/Sharp)
                    ctx.lineTo(r * 0.5, -r * 0.2);
                    ctx.lineTo(r * 1.5, 0);
                    ctx.lineTo(r * 0.5, r * 0.2);
                    break;
                case 'peace': // Lotus (Rounded)
                    ctx.bezierCurveTo(r * 0.8, -r * 0.6, r * 1.4, -r * 0.4, r * 1.5, 0);
                    ctx.bezierCurveTo(r * 1.4, r * 0.4, r * 0.8, r * 0.6, 0, 0);
                    break;
                case 'melancholy': // Willow (Thin, long)
                    ctx.bezierCurveTo(r * 0.5, -r * 0.1, r * 1.8, -r * 0.1, r * 2.0, 0);
                    ctx.bezierCurveTo(r * 1.8, r * 0.1, r * 0.5, r * 0.1, 0, 0);
                    break;
                case 'anxiety': // Aster (Needle-like)
                    ctx.lineTo(r, -2);
                    ctx.lineTo(r * 2.2, 0);
                    ctx.lineTo(r, 2);
                    break;
                case 'anger': // Flame (Irregular/Jagged)
                    ctx.lineTo(r * 0.6, -r * 0.4);
                    ctx.lineTo(r * 1.2, -r * 0.2);
                    ctx.lineTo(r * 1.6, 0);
                    ctx.lineTo(r * 1.2, r * 0.2);
                    ctx.lineTo(r * 0.6, r * 0.4);
                    break;
                case 'love': // Heart (Clefted)
                    ctx.bezierCurveTo(r * 0.5, -r * 0.8, r * 1.5, -r * 0.8, r * 1.5, 0);
                    ctx.bezierCurveTo(r * 1.5, r * 0.8, r * 0.5, r * 0.8, 0, 0);
                    // Add a little notch at the tip for heart feel
                    ctx.moveTo(r * 1.5, 0);
                    ctx.lineTo(r * 1.3, 0);
                    break;
                case 'confusion': // Fragment
                    ctx.lineTo(r * 0.4, -r * 0.3);
                    ctx.lineTo(r * 1.4, r * 0.1);
                    ctx.lineTo(r * 0.5, r * 0.5);
                    break;
                default:
                    ctx.arc(r * 0.7, 0, r * 0.4, 0, Math.PI * 2);
            }

            ctx.closePath();

            // Fill with a gradient for each petal
            const petalGrad = ctx.createLinearGradient(0, 0, r * 1.5, 0);
            petalGrad.addColorStop(0, color);
            petalGrad.addColorStop(1, `${color}44`);
            ctx.fillStyle = petalGrad;
            ctx.fill();
            ctx.stroke();

            ctx.restore();
        }

        // Center disk
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.4, 0, Math.PI * 2);
        const centerGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.4);
        centerGrad.addColorStop(0, '#FFFFFF');
        centerGrad.addColorStop(1, color);
        ctx.fillStyle = centerGrad;
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
    };

    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        timeRef.current += 0.016;

        const colors = emotionColors;
        const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-void').trim() || '#FDF9F6';

        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);

        // Background layer
        drawBackgroundFlow(ctx, width, height, timeRef.current);

        const nodes = nodesRef.current;
        if (nodes.length === 0) {
            animationRef.current = requestAnimationFrame(animate);
            return;
        }

        // Apply forces
        for (const node of nodes) {
            const center = emotionCenters[node.emotion];
            const targetX = width * 0.15 + center.x * width * 0.7;
            const targetY = height * 0.15 + center.y * height * 0.7;

            node.vx += (targetX - node.x) * 0.0003;
            node.vy += (targetY - node.y) * 0.0003;

            for (const other of nodes) {
                if (other.id === node.id) continue;
                const dx = node.x - other.x;
                const dy = node.y - other.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const minDist = (node.radius + other.radius) * 2;
                if (dist < minDist && dist > 0) {
                    const force = (minDist - dist) / dist * 0.02;
                    node.vx += dx * force;
                    node.vy += dy * force;
                }
            }

            node.vx *= 0.95;
            node.vy *= 0.95;
            node.x += node.vx;
            node.y += node.vy;

            node.x = Math.max(node.radius + 20, Math.min(width - node.radius - 20, node.x));
            node.y = Math.max(node.radius + 100, Math.min(height - node.radius - 100, node.y));
        }

        drawConnections(ctx, nodes, colors);

        for (const node of nodes) {
            drawFlower(ctx, node, timeRef.current, colors);
        }

        drawLegend(ctx, nodes, width, height, colors);

        animationRef.current = requestAnimationFrame(animate);
    }, []); // No theme dependency needed

    useEffect(() => {
        animationRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationRef.current);
    }, [animate]);

    const drawBackgroundFlow = (ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
        const flowColor = 'rgba(232, 164, 196, 0.03)';
        ctx.strokeStyle = flowColor;
        ctx.lineWidth = 1;
        for (let i = 0; i < 8; i++) {
            ctx.beginPath();
            const yBase = height * (0.1 + i * 0.1);
            ctx.moveTo(0, yBase);
            for (let x = 0; x <= width; x += 20) {
                const y = yBase + Math.sin(x * 0.005 + time * 0.3 + i) * 30;
                ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
        const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) * 0.8);
        gradient.addColorStop(0, 'rgba(232, 164, 196, 0.05)');
        gradient.addColorStop(0.6, 'rgba(196, 176, 232, 0.03)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    };

    const drawConnections = (ctx: CanvasRenderingContext2D, nodes: ConstellationNode[], colors: Record<Emotion, string>) => {
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const a = nodes[i];
                const b = nodes[j];
                if (a.emotion === b.emotion) {
                    const dx = b.x - a.x;
                    const dy = b.y - a.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 400) {
                        const opacity = (1 - dist / 400) * 0.2;
                        ctx.strokeStyle = `${colors[a.emotion]}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.quadraticCurveTo((a.x + b.x) / 2, (a.y + b.y) / 2 - dist * 0.1, b.x, b.y);
                        ctx.stroke();
                    }
                }
            }
        }
    };

    const drawLegend = (ctx: CanvasRenderingContext2D, nodes: ConstellationNode[], width: number, height: number, colors: Record<Emotion, string>) => {
        const emotions = [...new Set(nodes.map(n => n.emotion))];
        if (emotions.length === 0) return;
        const legendY = height - 60;
        const legendWidth = emotions.length * 80;
        const startX = (width - legendWidth) / 2;
        ctx.font = '11px DM Sans';
        ctx.textAlign = 'center';
        emotions.forEach((emotion, i) => {
            const x = startX + i * 80 + 40;
            ctx.beginPath();
            ctx.arc(x, legendY, 6, 0, Math.PI * 2);
            ctx.fillStyle = colors[emotion];
            ctx.fill();
            const labelColor = 'rgba(61, 58, 56, 0.6)';
            ctx.fillStyle = labelColor;
            ctx.fillText(emotion, x, legendY + 20);
        });
    };

    const handleExportTradingCard = async (aspect: 'square' | 'story') => {
        const width = 1080;
        const height = aspect === 'square' ? 1080 : 1920;
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = width;
        exportCanvas.height = height;
        const ctx = exportCanvas.getContext('2d');
        if (!ctx) return;

        const nodes = nodesRef.current;
        const emotions = [...new Set(nodes.map(n => n.emotion))];
        const domEmotion = emotions.reduce((a, b) =>
            nodes.filter(n => n.emotion === a).length >= nodes.filter(n => n.emotion === b).length ? a : b,
            'peace' as Emotion);
        const colors = emotionColors;
        const auraColor = colors[domEmotion];

        // 1. Background Fill
        ctx.fillStyle = '#FDF9F6';
        ctx.fillRect(0, 0, width, height);

        // 2. Card Border (Rose Gold Foil Style)
        const borderGrad = ctx.createLinearGradient(0, 0, width, height);
        borderGrad.addColorStop(0, '#E8A4C4'); // Rose Gold
        borderGrad.addColorStop(0.5, '#FFF0F5');
        borderGrad.addColorStop(1, '#C4B0E8'); // Lavender
        ctx.strokeStyle = borderGrad;
        ctx.lineWidth = 40;
        ctx.strokeRect(20, 20, width - 40, height - 40);

        // Inner Border
        ctx.strokeStyle = 'rgba(61, 58, 56, 0.1)';
        ctx.lineWidth = 1;
        ctx.strokeRect(60, 60, width - 120, height - 120);

        // 3. Card Header
        ctx.fillStyle = '#3D3A38';
        ctx.font = '500 42px Fraunces';
        ctx.textAlign = 'left';
        ctx.fillText('your meadow map', 100, 120);

        ctx.textAlign = 'right';
        ctx.font = '700 32px DM Sans';
        ctx.fillStyle = auraColor;
        ctx.fillText(domEmotion.toUpperCase(), width - 100, 115);

        // 4. Portrait Area (The Constellation)
        const portraitHeight = aspect === 'square' ? 500 : 850;
        ctx.save();
        ctx.beginPath();
        ctx.rect(100, 180, width - 200, portraitHeight);
        ctx.clip();

        // Portrait BG
        const bgGrad = ctx.createRadialGradient(width / 2, 180 + portraitHeight / 2, 0, width / 2, 180 + portraitHeight / 2, 500);
        bgGrad.addColorStop(0, `${auraColor}22`);
        bgGrad.addColorStop(1, '#FFFFFF');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(100, 180, width - 200, portraitHeight);

        // Draw nodes in portrait
        const contentScale = 0.8;
        const sourceCanvas = canvasRef.current!;
        const portraitWidth = width - 200;
        nodes.forEach(node => {
            const px = 100 + (node.x / sourceCanvas.width) * portraitWidth;
            const py = 180 + (node.y / sourceCanvas.height) * portraitHeight;
            const pr = node.radius * contentScale;

            // Draw Full Flower for print consistency
            const exportNode = {
                ...node,
                x: px,
                y: py,
                radius: pr,
                vx: 0,
                vy: 0
            };
            drawFlower(ctx, exportNode, 0, colors);
        });
        ctx.restore();

        // 5. Stats Area
        const statsY = 180 + portraitHeight + 60;
        ctx.fillStyle = '#3D3A38';
        ctx.font = '500 24px DM Sans';
        ctx.textAlign = 'left';
        ctx.fillText('Aura Composition:', 100, statsY);

        emotions.slice(0, 4).forEach((em, i) => {
            const count = nodes.filter(n => n.emotion === em).length;
            const x = 100 + (i % 2) * 400;
            const y = statsY + 60 + Math.floor(i / 2) * 50;

            ctx.beginPath();
            ctx.arc(x, y - 8, 8, 0, Math.PI * 2);
            ctx.fillStyle = colors[em];
            ctx.fill();

            ctx.fillStyle = 'rgba(61, 58, 56, 0.8)';
            ctx.font = '400 20px DM Sans';
            ctx.fillText(`${em}: ${count} blooms`, x + 30, y);
        });

        // 6. Signature / Footer
        const footerY = height - (aspect === 'square' ? 180 : 300);
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(61, 58, 56, 0.4)';
        ctx.font = 'italic 20px Fraunces';
        ctx.fillText(`"a garden of ${nodes.length} preserved reflections"`, width / 2, footerY);

        // Stats Bar at bottom
        const totalChars = nodes.reduce((sum, n) => sum + n.content.length, 0);
        ctx.fillStyle = 'rgba(61, 58, 56, 0.6)';
        ctx.font = '500 18px DM Sans';
        ctx.fillText(`Reflection Score: ${totalChars}  •  Date: ${new Date().toLocaleDateString()}`, width / 2, footerY + 50);

        ctx.font = '700 16px DM Sans';
        ctx.letterSpacing = '5px';
        ctx.fillText('udyāna', width / 2, footerY + 100);

        // 7. Holographic Shine Overlay
        const holoGrad = ctx.createLinearGradient(0, 0, width, height);
        holoGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        holoGrad.addColorStop(0.45, 'rgba(255, 255, 255, 0)');
        holoGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
        holoGrad.addColorStop(0.55, 'rgba(255, 255, 255, 0)');
        holoGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = holoGrad;
        ctx.fillRect(0, 0, width, height);

        // Download
        const link = document.createElement('a');
        link.download = `udyana-meadow-map-${aspect}-${Date.now()}.png`;
        link.href = exportCanvas.toDataURL('image/png');
        link.click();
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 100,
            background: 'var(--bg-void)',
        }}>
            <canvas ref={canvasRef} style={{ display: 'block' }} />

            {/* Header */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                padding: 'var(--sp-4)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'linear-gradient(180deg, rgba(253, 249, 246, 0.9) 0%, transparent 100%)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                    <Sparkles size={20} style={{ color: 'var(--accent-primary)' }} />
                    <h2 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.25rem',
                        color: 'var(--text-primary)',
                        fontWeight: 500,
                        margin: 0,
                    }}>
                        your mind meadow
                    </h2>
                </div>
                <button
                    onClick={onClose}
                    style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-sm)',
                    }}
                >
                    <X size={20} style={{ color: 'var(--text-secondary)' }} />
                </button>
            </div>

            {/* Trading Card Export */}
            <div style={{
                position: 'absolute',
                bottom: 'max(1.5rem, env(safe-area-inset-bottom))',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 'var(--sp-2)',
                background: 'var(--bg-surface)',
                padding: 'var(--sp-1) var(--sp-1)',
                borderRadius: 'var(--radius-full)',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border-subtle)',
            }}>
                <button
                    onClick={() => handleExportTradingCard('square')}
                    disabled={thoughts.length === 0}
                    className="ghost-btn"
                    style={{
                        padding: 'var(--sp-2) var(--sp-4)',
                        background: 'transparent',
                        color: thoughts.length ? 'var(--text-primary)' : 'var(--text-muted)',
                        border: 'none',
                        borderRadius: 'var(--radius-full)',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--sp-2)',
                        cursor: thoughts.length ? 'pointer' : 'default',
                        opacity: thoughts.length ? 1 : 0.6,
                    }}
                >
                    <Square size={16} />
                    Square
                </button>
                <div style={{ width: '1px', background: 'var(--border-subtle)', margin: 'var(--sp-2) 0' }} />
                <button
                    onClick={() => handleExportTradingCard('story')}
                    disabled={thoughts.length === 0}
                    className="ghost-btn"
                    style={{
                        padding: 'var(--sp-2) var(--sp-4)',
                        background: 'transparent',
                        color: thoughts.length ? 'var(--text-primary)' : 'var(--text-muted)',
                        border: 'none',
                        borderRadius: 'var(--radius-full)',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--sp-2)',
                        cursor: thoughts.length ? 'pointer' : 'default',
                        opacity: thoughts.length ? 1 : 0.6,
                    }}
                >
                    <Smartphone size={16} />
                    Story
                </button>
            </div>

            {/* Empty state */}
            {thoughts.length === 0 && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, rgba(232, 164, 196, 0.1), rgba(196, 176, 232, 0.1))',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto var(--sp-4)',
                    }}>
                        <FeatherIcon />
                    </div>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--text-secondary)' }}>
                        waiting for your first bloom
                    </p>
                </div>
            )}
        </div>
    );
};

const FeatherIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
        <line x1="16" y1="8" x2="2" y2="22" />
        <line x1="17.5" y1="15" x2="9" y2="15" />
    </svg>
);

export default Garden;
