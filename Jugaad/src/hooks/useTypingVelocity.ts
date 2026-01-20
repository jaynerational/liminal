import { useState, useRef, useCallback } from 'react';

const WINDOW_MS = 1000; // 1 second window
const MAX_KEYSTROKES = 10; // Normalize to this max

export const useTypingVelocity = () => {
    const [velocity, setVelocity] = useState(0);
    const timestampsRef = useRef<number[]>([]);

    const recordKeystroke = useCallback(() => {
        const now = Date.now();
        timestampsRef.current.push(now);

        // Remove old timestamps
        timestampsRef.current = timestampsRef.current.filter(
            t => now - t < WINDOW_MS
        );

        // Calculate velocity (0-1)
        const count = timestampsRef.current.length;
        const normalized = Math.min(count / MAX_KEYSTROKES, 1);
        setVelocity(normalized);
    }, []);

    return { velocity, recordKeystroke };
};
