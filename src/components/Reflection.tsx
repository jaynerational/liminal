import { useState } from 'react';
import { motion } from 'framer-motion';

interface ReflectionProps {
    chosen: string;
    onComplete: (reflection: string) => void;
    onSkip: () => void;
}

const PROMPTS = [
    "Why does this feel right?",
    "What made you save this one?",
    "How do you feel now that you've chosen?",
    "What would you tell someone who's facing the same choice?",
    "What's the first step you'll take?",
];

export function Reflection({ chosen, onComplete, onSkip }: ReflectionProps) {
    const [reflection, setReflection] = useState('');
    const [promptIndex] = useState(() => Math.floor(Math.random() * PROMPTS.length));

    const handleComplete = () => {
        onComplete(reflection.trim());
    };

    return (
        <motion.div
            className="reflection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
        >
            <motion.div
                className="reflection__header"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <span className="reflection__label">You chose</span>
                <h2 className="reflection__chosen">{chosen}</h2>
            </motion.div>

            <motion.div
                className="reflection__prompt-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <p className="reflection__prompt">{PROMPTS[promptIndex]}</p>
                <textarea
                    className="reflection__textarea"
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    placeholder="Take a moment to reflect..."
                    autoFocus
                    maxLength={500}
                />
                <span className="reflection__counter">
                    {reflection.length}/500
                </span>
            </motion.div>

            <motion.div
                className="reflection__actions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
            >
                <button
                    className="reflection__action reflection__action--primary"
                    onClick={handleComplete}
                    disabled={reflection.trim().length === 0}
                >
                    Save Reflection
                </button>
                <button
                    className="reflection__action reflection__action--secondary"
                    onClick={onSkip}
                >
                    Skip
                </button>
            </motion.div>
        </motion.div>
    );
}
