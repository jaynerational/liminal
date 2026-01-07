import { motion, AnimatePresence } from 'framer-motion';

interface KeptZoneProps {
    kept: string[];
}

export function KeptZone({ kept }: KeptZoneProps) {
    if (kept.length === 0) return null;

    return (
        <motion.div
            className="kept-zone"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            <p className="kept-zone__label">Saved</p>
            <div className="kept-zone__orbs">
                <AnimatePresence>
                    {kept.map((option) => (
                        <motion.div
                            key={option}
                            className="kept-zone__orb"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        >
                            {option}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
