import { useEffect, useState, useRef } from 'react';

const Spotlight = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const targetRef = useRef({ x: 0, y: 0 });
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            targetRef.current = { x: e.clientX, y: e.clientY };
        };

        const animate = () => {
            setPosition(prev => ({
                x: prev.x + (targetRef.current.x - prev.x) * 0.08,
                y: prev.y + (targetRef.current.y - prev.y) * 0.08,
            }));
            rafRef.current = requestAnimationFrame(animate);
        };

        window.addEventListener('mousemove', handleMouseMove);
        rafRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 5,
                background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(232, 164, 196, 0.1), rgba(240, 200, 152, 0.05) 30%, transparent 50%)`,
                transition: 'none',
            }}
        />
    );
};

export default Spotlight;
