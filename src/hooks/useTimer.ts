import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTimerProps {
    duration: number;
    onComplete: () => void;
    autoStart?: boolean;
}

export function useTimer({ duration, onComplete, autoStart = false }: UseTimerProps) {
    const [timeLeft, setTimeLeft] = useState(duration);
    const [isRunning, setIsRunning] = useState(autoStart);
    const intervalRef = useRef<number | null>(null);
    const onCompleteRef = useRef(onComplete);

    onCompleteRef.current = onComplete;

    const start = useCallback(() => {
        setIsRunning(true);
    }, []);

    const stop = useCallback(() => {
        setIsRunning(false);
    }, []);

    const reset = useCallback((newDuration?: number) => {
        setTimeLeft(newDuration ?? duration);
        setIsRunning(false);
    }, [duration]);

    useEffect(() => {
        if (!isRunning) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        intervalRef.current = window.setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setIsRunning(false);
                    onCompleteRef.current();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning]);

    const progress = (duration - timeLeft) / duration;
    const phase = timeLeft > 10 ? 'highlighted' : timeLeft > 5 ? 'dimming' : 'critical';

    return {
        timeLeft,
        isRunning,
        progress,
        phase,
        start,
        stop,
        reset,
    };
}
