import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

interface OrbProps {
    text: string;
    state: 'idle' | 'highlighted' | 'dimming' | 'critical' | 'kept';
    position?: { x: number; y: number };
    onClick?: () => void;
    style?: React.CSSProperties;
}

export function Orb({ text, state, position, onClick, style }: OrbProps) {
    const stateVariants: Variants = {
        idle: {
            opacity: 1,
            scale: [1, 1.03, 1],
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
            },
        },
        highlighted: {
            opacity: 1,
            scale: 1.05,
            transition: { duration: 0.3 },
        },
        dimming: {
            opacity: 0.7,
            scale: 1,
            transition: { duration: 0.3 },
        },
        critical: {
            opacity: 1,
            scale: [1, 1.05, 1],
            transition: {
                duration: 0.3,
                repeat: Infinity,
                ease: 'easeInOut',
            },
        },
        kept: {
            opacity: 1,
            scale: 0.9,
            transition: { duration: 0.3 },
        },
    };

    return (
        <motion.div
            className={`orb orb--${state}`}
            style={{
                left: position?.x,
                top: position?.y,
                ...style,
            }}
            onClick={onClick}
            initial={{ opacity: 0, scale: 0.8 }}
            variants={stateVariants}
            animate={state}
            exit={{
                opacity: 0,
                scale: 0,
                transition: { duration: 0.5 },
            }}
            whileHover={state === 'idle' ? { scale: 1.05 } : undefined}
        >
            <span className="orb__text">{text}</span>
        </motion.div>
    );
}
