import { useState, useEffect } from 'react';

interface LandingProps {
    onEnter: () => void;
}

interface Petal {
    id: number;
    x: number;
    delay: number;
    duration: number;
    size: number;
    color: string;
}

const petalColors = [
    '#E8A4C4', // Rose
    '#C4B0E8', // Lavender  
    '#A4D4C4', // Mint
    '#F0C898', // Honey
    '#F0C4D8', // Blush
];

const Landing = ({ onEnter }: LandingProps) => {
    const [entering, setEntering] = useState(false);
    const [petals, setPetals] = useState<Petal[]>([]);

    useEffect(() => {
        // Generate floating petals
        const newPetals: Petal[] = Array.from({ length: 30 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            delay: Math.random() * 8,
            duration: 8 + Math.random() * 6,
            size: 8 + Math.random() * 16,
            color: petalColors[Math.floor(Math.random() * petalColors.length)],
        }));
        setPetals(newPetals);
    }, []);

    const handleEnter = () => {
        setEntering(true);
        setTimeout(onEnter, 1200);
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(180deg, var(--bg-void) 0%, var(--bg-elevated) 50%, var(--bg-hover) 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                zIndex: 200,
            }}
        >
            {/* Floating petals */}
            <div
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    pointerEvents: 'none',
                }}
            >
                {petals.map((petal) => (
                    <div
                        key={petal.id}
                        style={{
                            position: 'absolute',
                            left: `${petal.x}%`,
                            top: '-5%',
                            width: `${petal.size}px`,
                            height: `${petal.size}px`,
                            background: petal.color,
                            borderRadius: '50% 0 50% 50%',
                            opacity: entering ? 0 : 0.6,
                            animation: `petal-drift ${petal.duration}s linear ${petal.delay}s infinite`,
                            transform: 'rotate(45deg)',
                            transition: 'opacity 0.5s ease',
                        }}
                    />
                ))}
            </div>

            {/* Soft gradient orb */}
            <div
                style={{
                    position: 'absolute',
                    width: '60vmax',
                    height: '60vmax',
                    background: 'radial-gradient(circle, rgba(232, 164, 196, 0.15) 0%, rgba(196, 176, 232, 0.1) 40%, transparent 70%)',
                    borderRadius: '50%',
                    animation: 'breathe 6s ease-in-out infinite',
                    opacity: entering ? 0 : 1,
                    transition: 'opacity 0.8s ease',
                }}
            />

            {/* Title */}
            <h1
                style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    letterSpacing: '0.1em',
                    marginBottom: 'var(--sp-3)',
                    opacity: entering ? 0 : 1,
                    transform: entering ? 'scale(1.1) translateY(-20px)' : 'scale(1)',
                    transition: 'all 0.8s var(--ease-expo)',
                    zIndex: 10,
                    textAlign: 'center',
                }}
            >
                udyāna
            </h1>

            {/* Tagline */}
            <p
                style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                    color: 'var(--text-secondary)',
                    marginBottom: 'var(--sp-8)',
                    opacity: entering ? 0 : 1,
                    transition: 'opacity 0.5s',
                    zIndex: 10,
                    textAlign: 'center',
                    maxWidth: '280px',
                    lineHeight: 1.5,
                }}
            >
                a gentle space for your thoughts to breathe
            </p>

            {/* Enter button */}
            <button
                onClick={handleEnter}
                disabled={entering}
                style={{
                    padding: 'var(--sp-4) var(--sp-8)',
                    background: 'linear-gradient(135deg, #E8A4C4 0%, #D494B4 100%)',
                    border: 'none',
                    borderRadius: 'var(--radius-full)',
                    color: 'white',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    letterSpacing: '0.08em',
                    cursor: 'pointer',
                    opacity: entering ? 0 : 1,
                    transform: entering ? 'translateY(10px)' : 'translateY(0)',
                    transition: 'all 0.6s var(--ease-expo)',
                    zIndex: 10,
                    boxShadow: '0 4px 20px rgba(232, 164, 196, 0.3)',
                }}
            >
                Begin your journey
            </button>
        </div>
    );
};

export default Landing;
