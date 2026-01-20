import { Emotion, emotionColors } from '../../utils/emotionDetector';

type Phase = 'WAITING' | 'DRIFTING' | 'FADING' | 'DISSOLVING';

interface PhaseIndicatorProps {
    opacity: number;
    emotion?: Emotion;
}

const getPhase = (opacity: number): Phase => {
    if (opacity > 0.75) return 'WAITING';
    if (opacity > 0.50) return 'DRIFTING';
    if (opacity > 0.25) return 'FADING';
    return 'DISSOLVING';
};

const phaseLabels: Record<Phase, string> = {
    WAITING: 'resting',
    DRIFTING: 'drifting',
    FADING: 'fading',
    DISSOLVING: 'releasing',
};

const phaseColors: Record<Phase, string> = {
    WAITING: 'var(--accent-primary)',     // Rose
    DRIFTING: 'var(--accent-secondary)',  // Lavender
    FADING: 'var(--accent-warm)',         // Honey
    DISSOLVING: 'var(--accent-tertiary)', // Mint
};

const PhaseIndicator = ({ opacity, emotion = 'peace' }: PhaseIndicatorProps) => {
    const phase = getPhase(opacity);

    return (
        <div style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: 'var(--sp-4)',
        }}>
            {/* Soft pill indicator */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 1rem',
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-full)',
                boxShadow: 'var(--shadow-sm)',
            }}>
                {/* Glow dot */}
                <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: phaseColors[phase],
                    boxShadow: `0 0 12px ${phaseColors[phase]}`,
                    animation: 'breathe 3s ease-in-out infinite',
                }} />

                <span style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    letterSpacing: '0.08em',
                    color: 'var(--text-secondary)',
                    transition: 'color 0.5s var(--ease-expo)',
                }}>
                    {phaseLabels[phase]}
                </span>
            </div>

            {/* Emotion badge */}
            <span style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.65rem',
                fontWeight: 400,
                letterSpacing: '0.05em',
                color: emotionColors[emotion],
                opacity: 0.8,
                transition: 'color 0.5s var(--ease-expo)',
            }}>
                feeling {emotion}
            </span>
        </div>
    );
};

export default PhaseIndicator;
export { getPhase };
export type { Phase };
