export type Emotion = 'joy' | 'peace' | 'melancholy' | 'anxiety' | 'anger' | 'love' | 'confusion';

const emotionKeywords: Record<Emotion, string[]> = {
    joy: ['happy', 'joy', 'excited', 'wonderful', 'amazing', 'great', 'fantastic', 'awesome', 'delighted', 'thrilled', 'celebrate', 'laugh', 'smile', 'fun', 'blessed'],
    peace: ['calm', 'peaceful', 'serene', 'quiet', 'still', 'tranquil', 'relaxed', 'content', 'zen', 'mindful', 'gentle', 'soft', 'rest', 'breathe', 'meditate'],
    melancholy: ['sad', 'blue', 'melancholy', 'lonely', 'miss', 'remember', 'nostalgia', 'wistful', 'sorrow', 'grief', 'loss', 'empty', 'cry', 'tears', 'ache'],
    anxiety: ['worried', 'anxious', 'nervous', 'scared', 'afraid', 'fear', 'panic', 'stress', 'overwhelmed', 'uncertain', 'dread', 'uneasy', 'restless', 'tense', 'doubt'],
    anger: ['angry', 'furious', 'rage', 'frustrated', 'annoyed', 'irritated', 'mad', 'hate', 'resentment', 'bitter', 'hostile', 'outraged', 'livid', 'upset', 'disgusted'],
    love: ['love', 'adore', 'cherish', 'heart', 'affection', 'care', 'tender', 'warm', 'embrace', 'kiss', 'devotion', 'passion', 'soulmate', 'beloved', 'romance'],
    confusion: ['confused', 'lost', 'uncertain', 'unsure', 'puzzled', 'bewildered', 'perplexed', 'torn', 'conflicted', 'questioning', 'wonder', 'mystery', 'strange', 'weird', 'unclear']
};

export const detectEmotion = (text: string): Emotion => {
    const lowerText = text.toLowerCase();
    const scores: Record<Emotion, number> = {
        joy: 0,
        peace: 0,
        melancholy: 0,
        anxiety: 0,
        anger: 0,
        love: 0,
        confusion: 0
    };

    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
        for (const keyword of keywords) {
            if (lowerText.includes(keyword)) {
                scores[emotion as Emotion]++;
            }
        }
    }

    // Find emotion with highest score
    let maxEmotion: Emotion = 'peace'; // Default
    let maxScore = 0;

    for (const [emotion, score] of Object.entries(scores)) {
        if (score > maxScore) {
            maxScore = score;
            maxEmotion = emotion as Emotion;
        }
    }

    return maxEmotion;
};

export const emotionColors: Record<Emotion, string> = {
    joy: '#E8A4C4',      // Soft rose
    peace: '#A4D4C4',    // Mint
    melancholy: '#C4B0E8', // Lavender
    anxiety: '#F0C898',  // Honey
    anger: '#E89494',    // Soft coral
    love: '#F0C4D8',     // Blush
    confusion: '#D4C4E8' // Pale lavender
};
