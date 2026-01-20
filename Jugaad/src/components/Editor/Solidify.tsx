import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Feather, Heart } from 'lucide-react';
import { Emotion } from '../../utils/emotionDetector';

type ExportFormat = 'SQUARE' | 'STORY';

interface SolidifyProps {
    content: string;
    emotion: Emotion;
    onSolidify: () => Promise<void>;
}

const formatDimensions: Record<ExportFormat, { width: number; height: number }> = {
    SQUARE: { width: 1080, height: 1080 },
    STORY: { width: 1080, height: 1920 },
};

const emotionGradients: Record<Emotion, string> = {
    joy: 'linear-gradient(135deg, #FFF9F0 0%, #FFE4B0 30%, #FFF0E0 70%, #FFFAF5 100%)',
    peace: 'linear-gradient(135deg, #F5FFF8 0%, #C4E8DC 30%, #E8FFF0 70%, #F8FFFA 100%)',
    melancholy: 'linear-gradient(135deg, #F0F8FF 0%, #B4D4E8 30%, #E0F0FF 70%, #F5FAFF 100%)',
    anxiety: 'linear-gradient(135deg, #FFFAF5 0%, #E8D4C4 30%, #FFF5E8 70%, #FFFCF8 100%)',
    anger: 'linear-gradient(135deg, #FFF5F5 0%, #E8B4B4 30%, #FFE8E8 70%, #FFFAFA 100%)',
    love: 'linear-gradient(135deg, #FFF5F8 0%, #F0C4D8 30%, #FFE8F0 70%, #FFFAFC 100%)',
    confusion: 'linear-gradient(135deg, #FAF5FF 0%, #D4C4E8 30%, #F0E8FF 70%, #FCFAFF 100%)',
};

const Solidify = ({ content, emotion, onSolidify }: SolidifyProps) => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [pendingFormat, setPendingFormat] = useState<ExportFormat | null>(null);

    const handleExportClick = (format: ExportFormat) => {
        setPendingFormat(format);
        setShowConfirmation(true);
    };

    const handleConfirmExport = async () => {
        if (!canvasRef.current || !content.trim() || !pendingFormat) return;

        const { width, height } = formatDimensions[pendingFormat];

        // Create export div with emotion-based gradient
        const exportDiv = document.createElement('div');
        exportDiv.style.cssText = `
            position: fixed;
            left: -9999px;
            width: ${width}px;
            height: ${height}px;
            background: ${emotionGradients[emotion]};
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 80px;
            font-family: 'DM Sans', sans-serif;
            color: #3D3A38;
        `;

        const textDiv = document.createElement('div');
        textDiv.style.cssText = `
            font-size: ${pendingFormat === 'STORY' ? '48px' : '36px'};
            line-height: 1.6;
            text-align: center;
            max-width: ${width - 160}px;
            word-wrap: break-word;
        `;
        textDiv.textContent = content;
        exportDiv.appendChild(textDiv);

        // Add subtle watermark
        const watermark = document.createElement('div');
        watermark.style.cssText = `
            position: absolute;
            bottom: 40px;
            font-size: 14px;
            color: rgba(61, 58, 56, 0.3);
            letter-spacing: 0.1em;
        `;
        watermark.textContent = 'udyāna';
        exportDiv.appendChild(watermark);

        document.body.appendChild(exportDiv);

        try {
            const canvas = await html2canvas(exportDiv, {
                width,
                height,
                scale: 1,
                useCORS: true,
                backgroundColor: null,
            });

            const link = document.createElement('a');
            link.download = `udyana-${pendingFormat.toLowerCase()}-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();

            // Save to IndexedDB as solidified
            await onSolidify();
        } finally {
            document.body.removeChild(exportDiv);
            setShowConfirmation(false);
            setPendingFormat(null);
        }
    };

    const handleCancel = () => {
        setShowConfirmation(false);
        setPendingFormat(null);
    };

    return (
        <>
            <div ref={canvasRef} style={{
                display: 'flex',
                gap: 'var(--sp-4)',
                marginTop: 'var(--sp-6)',
            }}>
                <button
                    onClick={() => handleExportClick('SQUARE')}
                    disabled={!content.trim()}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--sp-2)',
                        padding: 'var(--sp-3) var(--sp-6)',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-full)',
                        color: content.trim() ? 'var(--accent-primary)' : 'var(--text-muted)',
                        opacity: content.trim() ? 1 : 0.6,
                        fontFamily: 'var(--font-ui)',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        cursor: content.trim() ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s var(--ease-expo)',
                        boxShadow: 'var(--shadow-sm)',
                    }}
                >
                    <Feather size={16} />
                    preserve
                </button>
                <button
                    onClick={() => handleExportClick('STORY')}
                    disabled={!content.trim()}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--sp-2)',
                        padding: 'var(--sp-3) var(--sp-6)',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-full)',
                        color: content.trim() ? 'var(--accent-secondary)' : 'var(--text-muted)',
                        opacity: content.trim() ? 1 : 0.6,
                        fontFamily: 'var(--font-ui)',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        cursor: content.trim() ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s var(--ease-expo)',
                        boxShadow: 'var(--shadow-sm)',
                    }}
                >
                    <Heart size={16} />
                    share
                </button>
            </div>

            {/* Friction Modal */}
            {showConfirmation && (
                <div className="modal-overlay" onClick={handleCancel}>
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: 'var(--bg-surface)',
                            borderRadius: 'var(--radius-xl)',
                            padding: 'var(--sp-6)',
                            maxWidth: '360px',
                            textAlign: 'center',
                        }}
                    >
                        <div style={{
                            width: '64px',
                            height: '64px',
                            background: 'linear-gradient(135deg, rgba(232, 164, 196, 0.2), rgba(196, 176, 232, 0.2))',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto var(--sp-4)',
                        }}>
                            <Feather size={28} style={{ color: 'var(--accent-primary)' }} />
                        </div>

                        <h3 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.25rem',
                            color: 'var(--text-primary)',
                            marginBottom: 'var(--sp-3)',
                            fontWeight: 500,
                        }}>
                            a gentle pause
                        </h3>

                        <p style={{
                            fontFamily: 'var(--font-ui)',
                            fontSize: '0.95rem',
                            color: 'var(--text-secondary)',
                            lineHeight: 1.6,
                            marginBottom: 'var(--sp-5)',
                        }}>
                            are you sure you feel so strongly about this?
                            let it rest a moment longer.
                        </p>

                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--sp-3)',
                        }}>
                            <button
                                onClick={handleCancel}
                                className="btn-primary"
                                style={{
                                    borderRadius: 'var(--radius-full)',
                                }}
                            >
                                no, let it fade
                            </button>
                            <button
                                onClick={handleConfirmExport}
                                className="ghost-btn"
                                style={{
                                    borderRadius: 'var(--radius-full)',
                                    background: 'transparent',
                                    padding: 'var(--sp-3) var(--sp-5)',
                                }}
                            >
                                yes, preserve it
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Solidify;
