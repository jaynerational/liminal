import { useState } from 'react';
import Editor from './components/Editor/Editor';
import Shell from './components/Layout/Shell';
import Garden from './components/Garden/Garden';
import Landing from './components/Onboarding/Landing';
import FirstVisit from './components/Onboarding/FirstVisit';
import { Flower2 } from 'lucide-react';

function App() {
    const [typingVelocity, setTypingVelocity] = useState(0);
    const [showGarden, setShowGarden] = useState(false);
    const [showLanding, setShowLanding] = useState(true);
    const [showFirstVisit, setShowFirstVisit] = useState(false);

    return (
        <>
            {showLanding ? (
                <Landing onEnter={() => {
                    setShowLanding(false);
                    setShowFirstVisit(true);
                }} />
            ) : showGarden ? (
                <Garden onClose={() => setShowGarden(false)} />
            ) : (
                <>
                    {showFirstVisit && <FirstVisit onDismiss={() => setShowFirstVisit(false)} />}
                    <Shell typingVelocity={typingVelocity}>
                        <Editor onVelocityChange={setTypingVelocity} />
                        <button
                            onClick={() => setShowGarden(true)}
                            className="btn-icon"
                            style={{
                                position: 'fixed',
                                bottom: 'max(1.5rem, env(safe-area-inset-bottom, 1.5rem))',
                                right: '1.5rem',
                                color: 'var(--accent-primary)',
                            }}
                            title="open Garden"
                        >
                            <Flower2 size={24} />
                        </button>
                    </Shell>
                </>
            )}
        </>
    )
}

export default App
