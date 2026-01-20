import { useEffect, useState } from 'react';
import PhaseIndicator from './PhaseIndicator';
import Solidify from './Solidify';
import { useThought } from '../../hooks/useThought';
import { useTypingVelocity } from '../../hooks/useTypingVelocity';

interface EditorProps {
    onVelocityChange?: (velocity: number) => void;
}

const Editor = ({ onVelocityChange }: EditorProps) => {
    const { content, lastActive, emotion, updateContent, solidifyThought } = useThought();
    const { velocity, recordKeystroke } = useTypingVelocity();
    const [opacity, setOpacity] = useState(1);

    // Configuration
    const DECAY_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

    useEffect(() => {
        const interval = setInterval(() => {
            const elapsed = Date.now() - lastActive;
            const newOpacity = Math.max(0, 1 - (elapsed / DECAY_DURATION_MS));
            setOpacity(newOpacity);
        }, 1000);

        return () => clearInterval(interval);
    }, [lastActive]);

    useEffect(() => {
        onVelocityChange?.(velocity);
    }, [velocity, onVelocityChange]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateContent(e.target.value);
        setOpacity(1);
        recordKeystroke();
    };

    const handleSolidify = async () => {
        await solidifyThought();
        setOpacity(1); // Reset opacity for fresh canvas
    };

    return (
        <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '800px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <PhaseIndicator opacity={opacity} emotion={emotion} />
            <textarea
                value={content}
                onChange={handleChange}
                autoFocus
                placeholder="what's on your heart today?"
                style={{
                    width: '100%',
                    height: '50svh',
                    minHeight: '280px',
                    maxHeight: 'calc(100svh - 200px)',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    resize: 'none',
                    color: 'var(--txt-primary)',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '1.5rem',
                    lineHeight: '1.6',
                    caretColor: 'var(--acc-primary)',
                    textAlign: 'center',
                    padding: '1.5rem',
                    paddingBottom: 'env(safe-area-inset-bottom, 1rem)',
                    opacity: opacity,
                    transition: 'opacity 1s linear',
                }}
            />
            <Solidify
                content={content}
                emotion={emotion}
                onSolidify={handleSolidify}
            />
        </div>
    );
};

export default Editor;
