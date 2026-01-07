import { useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

interface ShareCardProps {
    chosen: string;
    released: string[];
    preciseDuration: string;
    onClose: () => void;
}

export function ShareCard({ chosen, released, preciseDuration, onClose }: ShareCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    const mockHash = useMemo(() => {
        return Math.random().toString(16).substring(2, 10).toUpperCase() +
            Math.random().toString(16).substring(2, 10).toUpperCase();
    }, []);

    const handleDownload = useCallback(async () => {
        if (!cardRef.current) return;

        try {
            const html2canvas = (await import('html2canvas')).default;

            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: '#050505',
                scale: 3,
            });

            const link = document.createElement('a');
            link.download = `conviction-${mockHash}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Failed to generate share card:', error);
            const text = `CONVICTION: ${chosen}\nVERDICT TIME: ${preciseDuration}s\n"Choice is a Sin. Commitment is Salvation."\n\n— LIMINAL`;
            navigator.clipboard.writeText(text);
            alert('Image export failed. Conviction details copied to clipboard!');
        }
    }, [chosen, mockHash, preciseDuration]);

    const handleShare = useCallback(async () => {
        if (typeof navigator.share !== 'undefined') {
            try {
                await navigator.share({
                    title: 'PROOF OF CONVICTION',
                    text: `I chose: "${chosen}" in ${preciseDuration}s\n\n"Choice is a Sin. Commitment is Salvation."`,
                    url: window.location.href,
                });
            } catch {
                // Ignore
            }
        } else {
            handleDownload();
        }
    }, [chosen, preciseDuration, handleDownload]);

    return (
        <motion.div
            className="share-card-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="share-card-container"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div ref={cardRef} className="share-card share-card--brutalist">
                    <div className="share-card__grain"></div>
                    <div className="share-card__header">
                        <span className="share-card__status">OFFICIAL CONVICTION RECORD</span>
                        <span className="share-card__hash">HASH: {mockHash}</span>
                    </div>

                    <div className="share-card__content">
                        <span className="share-card__label">THE CHOSEN TRUTH</span>
                        <h2 className="share-card__chosen">{chosen}</h2>
                    </div>

                    <div className="share-card__metrics">
                        <div className="share-card__metric">
                            <span className="share-card__metric-label">TIME TO VERDICT</span>
                            <span className="share-card__metric-value">{preciseDuration}s</span>
                        </div>
                        <div className="share-card__metric">
                            <span className="share-card__metric-label">PURGE STREAK</span>
                            <span className="share-card__metric-value">{released.length} OPTIONS</span>
                        </div>
                    </div>

                    <div className="share-card__footer">
                        <p className="share-card__manifesto">
                            CHOICE IS A SIN.<br />COMMITMENT IS SALVATION.
                        </p>
                        <span className="share-card__logo">LIMINAL</span>
                    </div>
                </div>

                <div className="share-card__actions">
                    <button className="share-card__btn share-card__btn--primary" onClick={handleShare}>
                        FLEX CONVICTION
                    </button>
                    <button className="share-card__btn share-card__btn--secondary" onClick={handleDownload}>
                        SAVE RECORD
                    </button>
                    <button className="share-card__btn share-card__btn--tertiary" onClick={onClose}>
                        DISMISS
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
