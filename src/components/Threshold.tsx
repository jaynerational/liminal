import { useState } from 'react';
import { motion } from 'framer-motion';
import type { DecisionMode } from '../hooks/useDecisionEngine';

interface ThresholdProps {
    onEnter: (options: string[], mode: DecisionMode) => void;
    onArchive: () => void;
}

export function Threshold({ onEnter, onArchive }: ThresholdProps) {
    const [input, setInput] = useState('');
    const [mode, setMode] = useState<DecisionMode>('standard');
    const [error, setError] = useState<string | null>(null);

    const parseOptions = (text: string): string[] => {
        return text
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line.length > 0)
            .map((line) => line.slice(0, 100));
    };

    const options = parseOptions(input);
    const isValid = options.length >= 2 && options.length <= 7;

    const handleEnter = () => {
        if (options.length < 2) {
            setError('Add at least 2 options to begin');
            return;
        }
        if (options.length > 7) {
            setError('Maximum 7 options allowed');
            return;
        }
        setError(null);
        onEnter(options, mode);
    };

    const getHintText = () => {
        if (error) return error;
        if (options.length === 0) return 'One option per line';
        if (options.length === 1) return 'Add at least one more option';
        if (options.length > 7) return 'Maximum 7 options allowed';
        return `${options.length} options ready`;
    };

    return (
        <motion.div
            className="threshold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
        >
            <motion.div
                className="threshold__header"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <h1 className="threshold__title">LIMINAL</h1>
                <p className="threshold__subtitle">
                    What you refuse to lose is what you truly want.
                </p>
            </motion.div>

            <motion.p
                className="threshold__prompt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
            >
                What are you deciding between?
            </motion.p>

            <motion.div
                className="threshold__input-container"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
            >
                <textarea
                    className="threshold__textarea"
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                        setError(null);
                    }}
                    placeholder="→ Option A&#10;→ Option B"
                    autoFocus
                />
                <p className={`threshold__hint ${error ? 'threshold__hint--error' : ''}`}>
                    {getHintText()}
                </p>
            </motion.div>

            <motion.div
                className="threshold__mode-toggle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
            >
                <button
                    className={`threshold__mode-btn ${mode === 'standard' ? 'threshold__mode-btn--active' : ''}`}
                    onClick={() => setMode('standard')}
                >
                    Standard (15s)
                </button>
                <button
                    className={`threshold__mode-btn ${mode === 'blitz' ? 'threshold__mode-btn--active' : ''}`}
                    onClick={() => setMode('blitz')}
                >
                    Blitz (6s-EXORCISM)
                </button>
            </motion.div>

            <motion.button
                className="threshold__enter"
                onClick={handleEnter}
                disabled={!isValid}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                Begin Exorcism
            </motion.button>

            <motion.span
                className="threshold__archive-link"
                onClick={onArchive}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
            >
                The Repository of Truth
            </motion.span>
        </motion.div>
    );
}
