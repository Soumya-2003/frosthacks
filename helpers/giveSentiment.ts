import { SentimentCategory } from "./constants";

interface SentimentCategoryData {
    label: string;
    description: string;
    range: [number, number];
    statements: Array<string>;
}

const sentimentCategories: { [key: string]: SentimentCategoryData } = {
    "VERY_NEGATIVE": {
        "label": "Very Sad 😔",
        "description": "Feeling extremely down and hopeless.",
        "range": [-1, -0.8],
        "statements": [
            "Don't lose hope, everything will be fine. Tough times don't last, but tough people do.",
            "You are stronger than you think. This pain is temporary, and brighter days are ahead.",
            "It's okay to feel this way. Reach out to someone you trust, you're not alone in this."
        ]
    },
    "NEGATIVE": {
        "label": "Sad 😞",
        "description": "Feeling unhappy and frustrated.",
        "range": [-0.8, -0.4],
        "statements": [
            "It's okay to feel down sometimes. Acknowledge it, and take one step at a time.",
            "Frustration means you care. Use it as motivation to find solutions and move forward.",
            "Be kind to yourself. Mistakes are just lessons in disguise, you are growing every day."
        ]
    },
    "NEUTRAL": {
        "label": "Neutral 😐",
        "description": "Feeling neither happy nor sad.",
        "range": [-0.4, 0.4],
        "statements": [
            "It's okay to have calm, neutral days. Use this time to reflect and recharge.",
            "Not every day has to be exciting. A balanced mindset is key to long-term happiness.",
            "Stay open to new experiences, even small changes can bring unexpected joy."
        ]
    },
    "POSITIVE": {
        "label": "Happy 🙂",
        "description": "Feeling joyful and content.",
        "range": [0.4, 0.8],
        "statements": [
            "Good job on being happy! Keep doing what brings you joy and fulfillment.",
            "Happiness is a journey, not a destination. Keep finding reasons to smile every day.",
            "Enjoy this feeling and share your positivity with others. Happiness grows when shared!"
        ]
    },
    "VERY_POSITIVE": {
        "label": "Very Happy 😊",
        "description": "Feeling extremely happy and elated.",
        "range": [0.8, 1],
        "statements": [
            "You're radiating positivity! Keep spreading the joy and inspiring others.",
            "Life is amazing, enjoy every moment. Keep doing what makes your heart full.",
            "Your energy is contagious! Stay grateful and keep embracing new adventures."
        ]
    }
};

export const getSentimentStatement = (score: number) => {
    for (const category in sentimentCategories) {
        const range = sentimentCategories[category].range;
        if (score >= range[0] && score <= range[1]) {
            return sentimentCategories[category];
        }
    }
    return null;
}

