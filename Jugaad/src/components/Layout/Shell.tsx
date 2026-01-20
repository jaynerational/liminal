import React, { ReactNode } from 'react';
import Grain from '../Atmosphere/Grain';
import Vignette from '../Atmosphere/Vignette';
import Spotlight from '../Atmosphere/Spotlight';
import SpotlightBackground from '../Atmosphere/SpotlightBackground';
import VelocityCanvas from '../Atmosphere/VelocityCanvas';

interface ShellProps {
    children: ReactNode;
    typingVelocity?: number;
}

const Shell: React.FC<ShellProps> = ({ children, typingVelocity = 0 }) => {
    return (
        <div style={{
            position: 'relative',
            height: '100%',
            width: '100%',
            overflow: 'hidden',
            background: 'var(--bg-void)',
        }}>
            {/* Atmosphere Layer */}
            <SpotlightBackground />
            <VelocityCanvas typingVelocity={typingVelocity} />
            <Spotlight />
            <Grain />
            <Vignette />

            {/* Content Layer */}
            <div style={{
                position: 'relative',
                zIndex: 10,
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {children}
            </div>
        </div>
    );
};

export default Shell;
