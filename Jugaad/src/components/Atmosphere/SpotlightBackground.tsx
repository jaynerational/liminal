import { useState, useEffect } from 'react';

/**
 * SpotlightBackground — Living Ambient Effect
 * A subtle radial gradient follows the cursor, creating an ambient "spotlight" effect.
 * The background is aware of the user's presence.
 */
export const SpotlightBackground = () => {
    const [position, setPosition] = useState({ x: 50, y: 50 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Throttle to 60fps using requestAnimationFrame
            requestAnimationFrame(() => {
                const x = (e.clientX / window.innerWidth) * 100;
                const y = (e.clientY / window.innerHeight) * 100;
                setPosition({ x, y });
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div
            className="spotlight-background"
            style={{
                '--spot-x': `${position.x}%`,
                '--spot-y': `${position.y}%`,
            } as React.CSSProperties}
        />
    );
};

export default SpotlightBackground;
