import { motion } from 'framer-motion';
import { useArchive } from '../hooks/useArchive';

interface ArchiveProps {
    onBack: () => void;
}

export function Archive({ onBack }: ArchiveProps) {
    const { decisions, isLoading } = useArchive();

    const formatDuration = (seconds: number) => {
        if (seconds < 60) return `${seconds}s`;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    return (
        <motion.div
            className="archive"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="archive__header">
                <h1 className="archive__title">REPOSITORY OF TRUTH</h1>
                <motion.button
                    className="archive__back"
                    onClick={onBack}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    ← EXIT
                </motion.button>
            </div>

            <div className="archive__list">
                {isLoading ? (
                    <div className="archive__loading">ACCESSING RECORDS...</div>
                ) : decisions.length === 0 ? (
                    <div className="archive__empty">NO CONVICTIONS RECORDED.</div>
                ) : (
                    decisions.map((decision) => (
                        <motion.div
                            key={decision.id}
                            className={`archive__item archive__item--${decision.mode}`}
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                        >
                            <div className="archive__item-header">
                                <span className="archive__item-date">
                                    {formatDate(new Date(decision.created_at))}
                                </span>
                                <span className="archive__item-chosen">
                                    {decision.chosen}
                                </span>
                            </div>

                            {decision.released.length > 0 && (
                                <div className="archive__item-released">
                                    {decision.released.map((option) => (
                                        <span key={option} className="archive__item-option">
                                            {option}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="archive__item-footer">
                                <span className="archive__item-stat">
                                    VERDICT TIME: {formatDuration(decision.duration_seconds)}
                                </span>
                                <span className="archive__item-stat">
                                    {decision.mode === 'blitz' ? '⚡ BLITZ' : '⏳ STANDARD'}
                                </span>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </motion.div>
    );
}
