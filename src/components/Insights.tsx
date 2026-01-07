import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Decision } from '../db';

interface InsightsProps {
    decisions: Decision[];
    onBack: () => void;
}

export function Insights({ decisions, onBack }: InsightsProps) {
    const stats = useMemo(() => {
        if (decisions.length === 0) {
            return null;
        }

        // Total decisions
        const total = decisions.length;

        // Average decision time
        const avgTime = Math.round(
            decisions.reduce((sum, d) => sum + d.duration_seconds, 0) / total
        );

        // Average options per decision
        const avgOptions = (
            decisions.reduce((sum, d) => sum + d.options.length, 0) / total
        ).toFixed(1);

        // Mode breakdown
        const standardCount = decisions.filter((d) => d.mode === 'standard').length;
        const blitzCount = decisions.filter((d) => d.mode === 'blitz').length;

        // Day of week analysis
        const dayCount: Record<string, number> = {};
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        decisions.forEach((d) => {
            const day = days[new Date(d.created_at).getDay()];
            dayCount[day] = (dayCount[day] || 0) + 1;
        });
        const mostDecisiveDay = Object.entries(dayCount).sort((a, b) => b[1] - a[1])[0];

        // Release rate
        const totalOptions = decisions.reduce((sum, d) => sum + d.options.length, 0);
        const totalReleased = decisions.reduce((sum, d) => sum + d.released.length, 0);
        const releaseRate = Math.round((totalReleased / totalOptions) * 100);

        // Decisions this week
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thisWeek = decisions.filter((d) => new Date(d.created_at) >= weekAgo).length;

        // Fastest and slowest decisions
        const sorted = [...decisions].sort((a, b) => a.duration_seconds - b.duration_seconds);
        const fastest = sorted[0];
        const slowest = sorted[sorted.length - 1];

        return {
            total,
            avgTime,
            avgOptions,
            standardCount,
            blitzCount,
            mostDecisiveDay,
            releaseRate,
            thisWeek,
            fastest,
            slowest,
        };
    }, [decisions]);

    const formatDuration = (seconds: number) => {
        if (seconds < 60) return `${seconds}s`;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
    };

    return (
        <motion.div
            className="insights"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="insights__header">
                <h1 className="insights__title">Decision Insights</h1>
                <button className="insights__back" onClick={onBack}>
                    ← Back
                </button>
            </div>

            {!stats ? (
                <div className="insights__empty">
                    <p>No decisions yet.</p>
                    <p>Complete a ritual to see your insights.</p>
                </div>
            ) : (
                <div className="insights__content">
                    {/* Hero stats */}
                    <div className="insights__hero">
                        <motion.div
                            className="insights__hero-stat"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <span className="insights__hero-value">{stats.total}</span>
                            <span className="insights__hero-label">Decisions Made</span>
                        </motion.div>
                        <motion.div
                            className="insights__hero-stat"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <span className="insights__hero-value">{stats.thisWeek}</span>
                            <span className="insights__hero-label">This Week</span>
                        </motion.div>
                    </div>

                    {/* Stats grid */}
                    <div className="insights__grid">
                        <motion.div
                            className="insights__card"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <span className="insights__card-icon">⏱️</span>
                            <span className="insights__card-value">{formatDuration(stats.avgTime)}</span>
                            <span className="insights__card-label">Avg Time to Decide</span>
                        </motion.div>

                        <motion.div
                            className="insights__card"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.35 }}
                        >
                            <span className="insights__card-icon">🎯</span>
                            <span className="insights__card-value">{stats.avgOptions}</span>
                            <span className="insights__card-label">Avg Options</span>
                        </motion.div>

                        <motion.div
                            className="insights__card"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <span className="insights__card-icon">💨</span>
                            <span className="insights__card-value">{stats.releaseRate}%</span>
                            <span className="insights__card-label">Release Rate</span>
                        </motion.div>

                        <motion.div
                            className="insights__card"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.45 }}
                        >
                            <span className="insights__card-icon">📅</span>
                            <span className="insights__card-value">{stats.mostDecisiveDay?.[0]?.slice(0, 3)}</span>
                            <span className="insights__card-label">Most Decisive Day</span>
                        </motion.div>
                    </div>

                    {/* Mode breakdown */}
                    <motion.div
                        className="insights__section"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <h3 className="insights__section-title">Mode Breakdown</h3>
                        <div className="insights__modes">
                            <div className="insights__mode">
                                <span className="insights__mode-icon">⏳</span>
                                <span className="insights__mode-count">{stats.standardCount}</span>
                                <span className="insights__mode-label">Standard</span>
                            </div>
                            <div className="insights__mode">
                                <span className="insights__mode-icon">⚡</span>
                                <span className="insights__mode-count">{stats.blitzCount}</span>
                                <span className="insights__mode-label">Blitz</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Extremes */}
                    <motion.div
                        className="insights__section"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <h3 className="insights__section-title">Extremes</h3>
                        <div className="insights__extremes">
                            <div className="insights__extreme">
                                <span className="insights__extreme-label">⚡ Fastest</span>
                                <span className="insights__extreme-value">{stats.fastest.chosen}</span>
                                <span className="insights__extreme-time">
                                    {formatDuration(stats.fastest.duration_seconds)}
                                </span>
                            </div>
                            <div className="insights__extreme">
                                <span className="insights__extreme-label">🐢 Slowest</span>
                                <span className="insights__extreme-value">{stats.slowest.chosen}</span>
                                <span className="insights__extreme-time">
                                    {formatDuration(stats.slowest.duration_seconds)}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
}
