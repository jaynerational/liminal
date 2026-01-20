import { useState, useEffect, useCallback, useRef } from 'react';
import { db, Thought } from '../db';
import { detectEmotion, Emotion } from '../utils/emotionDetector';

const AUTOSAVE_DELAY_MS = 1000; // 1 second debounce

export const useThought = () => {
    const [thought, setThought] = useState<Thought | null>(null);
    const [content, setContent] = useState('');
    const [lastActive, setLastActive] = useState(Date.now());
    const [emotion, setEmotion] = useState<Emotion>('peace');
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    // Load the most recent NON-solidified thought on mount
    useEffect(() => {
        const loadThought = async () => {
            const thoughts = await db.thoughts
                .where('solidified')
                .equals(0)
                .reverse()
                .sortBy('lastActiveAt');

            if (thoughts.length > 0) {
                const t = thoughts[0];
                setThought(t);
                setContent(t.content);
                setLastActive(t.lastActiveAt);
                setEmotion((t.emotion as Emotion) || 'peace');
            }
        };
        loadThought();
    }, []);

    // Debounced save function
    const saveThought = useCallback(async (newContent: string, newLastActive: number, newEmotion: Emotion) => {
        if (thought?.id) {
            await db.thoughts.update(thought.id, {
                content: newContent,
                lastActiveAt: newLastActive,
                emotion: newEmotion,
            });
        } else {
            const id = await db.thoughts.add({
                content: newContent,
                createdAt: newLastActive,
                lastActiveAt: newLastActive,
                emotion: newEmotion,
                solidified: 0,
            });
            setThought({
                id: id as number,
                content: newContent,
                createdAt: newLastActive,
                lastActiveAt: newLastActive,
                emotion: newEmotion,
                solidified: 0
            });
        }
    }, [thought]);

    const updateContent = (newContent: string) => {
        const now = Date.now();
        const detectedEmotion = detectEmotion(newContent);
        setContent(newContent);
        setLastActive(now);
        setEmotion(detectedEmotion);

        // Debounce save
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
            saveThought(newContent, now, detectedEmotion);
        }, AUTOSAVE_DELAY_MS);
    };

    // Solidify current thought - marks it as preserved and clears for fresh input
    const solidifyThought = async () => {
        if (thought?.id && content.trim()) {
            // Mark current thought as solidified (1)
            await db.thoughts.update(thought.id, {
                solidified: 1,
                emotion: emotion,
            });

            // Clear state for fresh input
            setThought(null);
            setContent('');
            setLastActive(Date.now());
            setEmotion('peace');

            return true;
        }
        return false;
    };

    return {
        content,
        lastActive,
        emotion,
        updateContent,
        solidifyThought,
    };
};
