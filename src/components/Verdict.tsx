import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShareCard } from './ShareCard';

interface VerdictProps {
    chosen: string;
    released: string[];
    preciseDuration: string;
    onSave: () => void;
    onNewDecision: () => void;
}

export function Verdict({
    chosen,
    released,
    preciseDuration,
    onSave,
    onNewDecision,
}: VerdictProps) {
    const [showShareCard, setShowShareCard] = useState(false);

    return (
        <motion.div
            className="verdict"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <motion.span
                className="verdict__label"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                CONVICTION ACHIEVED
            </motion.span>

            <motion.div
                className="verdict__orb"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 20 }}
            >
                <div className="verdict__orb-inner">
                    <motion.span
                        className="verdict__text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        {chosen}
                    </motion.span>
                </div>
            </motion.div>

            <motion.p
                className="verdict__insight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                "Choice is a Sin. Commitment is Salvation."
            </motion.p>

            <motion.div
                className="verdict__stats"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
            >
                <div className="verdict__stat">
                    <span className="verdict__stat-value">{preciseDuration}s</span>
                    <span className="verdict__stat-label">TIME TO VERDICT</span>
                </div>
                <div className="verdict__stat">
                    <span className="verdict__stat-value">{released.length}</span>
                    <span className="verdict__stat-label">OPTIONS PURGED</span>
                </div>
            </motion.div>

            <motion.div
                className="verdict__actions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
            >
                <motion.button
                    className="verdict__action verdict__action--primary"
                    onClick={() => setShowShareCard(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    PROOF OF CONVICTION
                </motion.button>
                <motion.button
                    className="verdict__action verdict__action--secondary"
                    onClick={onSave}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    COMMIT TO REPOSITORY
                </motion.button>
                <motion.button
                    className="verdict__action verdict__action--tertiary"
                    onClick={onNewDecision}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    NEW EXORCISM
                </motion.button>
            </motion.div>

            {showShareCard && (
                <ShareCard
                    chosen={chosen}
                    released={released}
                    preciseDuration={preciseDuration}
                    onClose={() => setShowShareCard(false)}
                />
            )}
        </motion.div>
    );
}
