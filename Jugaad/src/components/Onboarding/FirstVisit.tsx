import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

const STORAGE_KEY = 'udyana_visited';

interface FirstVisitProps {
    onDismiss: () => void;
}

const FirstVisit = ({ onDismiss }: FirstVisitProps) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const visited = localStorage.getItem(STORAGE_KEY);
        if (!visited) {
            setVisible(true);
        }
    }, []);

    const handleDismiss = () => {
        localStorage.setItem(STORAGE_KEY, 'true');
        setVisible(false);
        onDismiss();
    };

    if (!visible) return null;

    return (
        <div
            className="modal-overlay"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(61, 58, 56, 0.3)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 150,
                padding: 'var(--sp-4)',
            }}
        >
            <div
                style={{
                    maxWidth: '400px',
                    padding: 'var(--sp-6)',
                    background: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid var(--border-subtle)',
                    textAlign: 'center',
                    boxShadow: 'var(--shadow-lg)',
                }}
            >
                {/* Icon */}
                <div style={{
                    width: '72px',
                    height: '72px',
                    background: 'linear-gradient(135deg, rgba(232, 164, 196, 0.2), rgba(196, 176, 232, 0.2))',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto var(--sp-5)',
                }}>
                    <Heart size={32} style={{ color: 'var(--accent-primary)' }} />
                </div>

                <h2
                    style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.5rem',
                        fontWeight: 500,
                        color: 'var(--text-primary)',
                        marginBottom: 'var(--sp-3)',
                    }}
                >
                    welcome
                </h2>
                <p
                    style={{
                        fontFamily: 'var(--font-ui)',
                        fontSize: '0.95rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.7,
                        marginBottom: 'var(--sp-4)',
                    }}
                >
                    this is a gentle space to write down what you're feeling.
                    your thoughts will slowly fade over time —
                    a reminder that emotions pass.
                </p>
                <p
                    style={{
                        fontFamily: 'var(--font-ui)',
                        fontSize: '0.85rem',
                        color: 'var(--text-muted)',
                        marginBottom: 'var(--sp-6)',
                        lineHeight: 1.5,
                    }}
                >
                    you can preserve and hold emotions ,
                    or simply let them go.
                </p>
                <button
                    onClick={handleDismiss}
                    style={{
                        padding: 'var(--sp-3) var(--sp-6)',
                        background: 'linear-gradient(135deg, var(--accent-primary), #D494B4)',
                        border: 'none',
                        borderRadius: 'var(--radius-full)',
                        color: 'white',
                        fontFamily: 'var(--font-ui)',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-glow-accent)',
                    }}
                >
                    I'm ready
                </button>
            </div>
        </div>
    );
};

export default FirstVisit;
