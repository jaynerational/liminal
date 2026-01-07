import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Orb } from './Orb';

interface LiminalSpaceProps {
    options: string[];
    onBegin: () => void;
}

export function LiminalSpace({ options, onBegin }: LiminalSpaceProps) {
    // Calculate orb positions in a circle
    const positions = useMemo(() => {
        const centerX = 300;
        const centerY = 300;
        const radius = 200;

        return options.map((_, i) => {
            const angle = (2 * Math.PI * i) / options.length;
            return {
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle),
            };
        });
    }, [options]);

    return (
        <motion.div
            className="liminal-space"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="liminal-space__instructions">
                <h2 className="liminal-space__title">THE GATHERING</h2>
                <p className="liminal-space__desc">
                    Your doubts are orbs. Your gut is the storm.<br />
                    Once the ritual begins, there is no undo.
                </p>
            </div>

            <div className="liminal-space__arena">
                <svg width="600" height="600" viewBox="0 0 600 600" className="liminal-space__svg">
                    {options.map((option, i) => (
                        <Orb
                            key={option}
                            text={option}
                            state="idle"
                            position={positions[i]}
                        />
                    ))}
                </svg>
            </div>

            <motion.button
                className="liminal-space__start"
                onClick={onBegin}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                START EXORCISM
            </motion.button>
        </motion.div>
    );
}
