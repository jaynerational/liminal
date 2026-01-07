import { useState, useCallback, useRef } from 'react';

export type RitualPhase = 'threshold' | 'liminal' | 'fading' | 'verdict' | 'archive';
export type DecisionMode = 'standard' | 'blitz';

interface DecisionState {
    options: string[];
    inLimbo: string[];
    kept: string[];
    released: string[];
    currentFading: string | null;
    chosen: string | null;
    mode: DecisionMode;
}

export function useDecisionEngine() {
    const [phase, setPhase] = useState<RitualPhase>('threshold');
    const [state, setState] = useState<DecisionState>({
        options: [],
        inLimbo: [],
        kept: [],
        released: [],
        currentFading: null,
        chosen: null,
        mode: 'standard',
    });
    const startTimeRef = useRef<number>(0);

    const enterLiminal = useCallback((options: string[], mode: DecisionMode = 'standard') => {
        setState({
            options,
            inLimbo: [...options],
            kept: [],
            released: [],
            currentFading: null,
            chosen: null,
            mode,
        });
        setPhase('liminal');
    }, []);

    const selectNextFading = useCallback(() => {
        setState((prev) => {
            const available = prev.inLimbo.filter((o) => o !== prev.currentFading);
            if (available.length === 0) {
                return prev;
            }
            const randomIndex = Math.floor(Math.random() * available.length);
            return {
                ...prev,
                currentFading: available[randomIndex],
            };
        });
    }, []);

    const beginRitual = useCallback(() => {
        startTimeRef.current = Date.now();
        setPhase('fading');
        selectNextFading();
    }, [selectNextFading]);

    const saveOption = useCallback((option: string) => {
        setState((prev) => {
            const newInLimbo = prev.inLimbo.filter((o) => o !== option);
            const newKept = [...prev.kept, option];

            // Check if ritual should end
            if (newInLimbo.length === 0) {
                if (newKept.length === 1) {
                    return {
                        ...prev,
                        inLimbo: newInLimbo,
                        kept: newKept,
                        currentFading: null,
                        chosen: newKept[0],
                    };
                }
            }

            return {
                ...prev,
                inLimbo: newInLimbo,
                kept: newKept,
                currentFading: null,
            };
        });
    }, []);

    const releaseOption = useCallback((option: string) => {
        setState((prev) => {
            const newInLimbo = prev.inLimbo.filter((o) => o !== option);
            const newReleased = [...prev.released, option];

            // Check if ritual should end
            const remaining = newInLimbo.length + prev.kept.length;
            if (remaining === 1) {
                const chosen = newInLimbo[0] || prev.kept[0];
                return {
                    ...prev,
                    inLimbo: newInLimbo,
                    released: newReleased,
                    currentFading: null,
                    chosen,
                };
            }

            return {
                ...prev,
                inLimbo: newInLimbo,
                released: newReleased,
                currentFading: null,
            };
        });
    }, []);

    const proceedToVerdict = useCallback(() => {
        setState((prev) => {
            if (prev.chosen) return prev;

            const remaining = [...prev.inLimbo, ...prev.kept];
            if (remaining.length === 1) {
                return { ...prev, chosen: remaining[0] };
            }
            if (prev.kept.length > 0) {
                return { ...prev, chosen: prev.kept[0] };
            }
            if (prev.inLimbo.length > 0) {
                return { ...prev, chosen: prev.inLimbo[0] };
            }
            return prev;
        });
        setPhase('verdict');
    }, []);

    const getDuration = useCallback(() => {
        return Math.round((Date.now() - startTimeRef.current) / 1000);
    }, []);

    const getPreciseDuration = useCallback(() => {
        return ((Date.now() - startTimeRef.current) / 1000).toFixed(2);
    }, []);

    const reset = useCallback(() => {
        setState({
            options: [],
            inLimbo: [],
            kept: [],
            released: [],
            currentFading: null,
            chosen: null,
            mode: 'standard',
        });
        setPhase('threshold');
    }, []);

    const goToArchive = useCallback(() => {
        setPhase('archive');
    }, []);

    return {
        phase,
        state,
        enterLiminal,
        beginRitual,
        selectNextFading,
        saveOption,
        releaseOption,
        proceedToVerdict,
        getDuration,
        getPreciseDuration,
        reset,
        goToArchive,
        setPhase,
    };
}
