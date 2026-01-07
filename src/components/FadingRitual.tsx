import { useEffect, useCallback, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimer } from '../hooks/useTimer';
import { KeptZone } from './KeptZone';
import { ParticleExplosion } from './ParticleExplosion';
import type { DecisionMode } from '../hooks/useDecisionEngine';

interface FadingRitualProps {
    inLimbo: string[];
    kept: string[];
    currentFading: string | null;
    mode: DecisionMode;
    onSave: (option: string) => void;
    onRelease: (option: string) => void;
    onSelectNext: () => void;
    onComplete: () => void;
}

export function FadingRitual({
    inLimbo,
    kept,
    currentFading,
    mode,
    onSave,
    onRelease,
    onSelectNext,
    onComplete,
}: FadingRitualProps) {
    const timerDuration = mode === 'blitz' ? 6 : 15;

    const [explosion, setExplosion] = useState<{ active: boolean; x: number; y: number }>({
        active: false,
        x: 0,
        y: 0,
    });
    const hasActedRef = useRef(false);

    const handleTimerComplete = useCallback(() => {
        if (currentFading && !hasActedRef.current) {
            hasActedRef.current = true;
            setExplosion({
                active: true,
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
            });
            setTimeout(() => onRelease(currentFading), 0);
        }
    }, [currentFading, onRelease]);

    const { timeLeft, phase, start, reset } = useTimer({
        duration: timerDuration,
        onComplete: handleTimerComplete,
    });

    useEffect(() => {
        if (currentFading) {
            hasActedRef.current = false;
            reset(timerDuration);
            start();
        }
    }, [currentFading, reset, start, timerDuration]);

    useEffect(() => {
        if (!currentFading && inLimbo.length > 0) {
            const timeout = setTimeout(() => {
                const totalRemaining = inLimbo.length + kept.length;
                if (totalRemaining <= 1) {
                    onComplete();
                } else if (inLimbo.length > 0) {
                    onSelectNext();
                } else if (kept.length > 1) {
                    onComplete();
                }
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [currentFading, inLimbo.length, kept.length, onSelectNext, onComplete]);

    useEffect(() => {
        if (inLimbo.length === 0 && !currentFading) {
            const timeout = setTimeout(() => {
                onComplete();
            }, 300);
            return () => clearTimeout(timeout);
        }
    }, [inLimbo.length, currentFading, onComplete]);

    const handleSave = () => {
        if (currentFading && !hasActedRef.current) {
            hasActedRef.current = true;
            onSave(currentFading);
        }
    };

    const handleRelease = () => {
        if (currentFading && !hasActedRef.current) {
            hasActedRef.current = true;
            setExplosion({
                active: true,
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
            });
            onRelease(currentFading);
        }
    };

    const handleExplosionComplete = () => {
        setExplosion({ active: false, x: 0, y: 0 });
    };

    const progress = ((timerDuration - timeLeft) / timerDuration) * 100;

    return (
        <motion.div
            className={`fading-ritual fading-ritual--${mode}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {mode === 'blitz' && (
                <div className="blitz-watermark">EXORCISM IN PROGRESS</div>
            )}

            <div className="fading-ritual__timer">
                <motion.span
                    className={`fading-ritual__countdown fading-ritual__countdown--${phase}`}
                    key={timeLeft}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.15 }}
                >
                    {timeLeft}
                </motion.span>
                <div className="fading-ritual__progress">
                    <div
                        className={`fading-ritual__progress-fill fading-ritual__progress-fill--${phase}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="fading-ritual__arena">
                <AnimatePresence mode="wait">
                    {currentFading && (
                        <motion.div
                            key={currentFading}
                            className="fading-ritual__center-orb"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="fading-ritual__orb-wrapper">
                                <div
                                    className={`fading-ritual__main-orb fading-ritual__main-orb--${phase}`}
                                    onClick={handleSave}
                                >
                                    <span className="fading-ritual__main-orb-text">
                                        {currentFading}
                                    </span>
                                </div>
                            </div>

                            <div className="fading-ritual__actions">
                                <motion.button
                                    className="fading-ritual__action fading-ritual__action--save"
                                    onClick={handleSave}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    COMMIT
                                </motion.button>
                                <motion.button
                                    className="fading-ritual__action fading-ritual__action--release"
                                    onClick={handleRelease}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    PURGE
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <KeptZone kept={kept} />

            <ParticleExplosion
                trigger={explosion.active}
                x={explosion.x}
                y={explosion.y}
                onComplete={handleExplosionComplete}
            />
        </motion.div>
    );
}
