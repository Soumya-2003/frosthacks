import { SentimentCategory } from "./constants";

interface SentimentCategoryData {
    label: string;
    description: string;
    range: [number, number];
    statements: Array<string>;
}

const sentimentCategories: { [key: string]: SentimentCategoryData } = {
    VERY_NEGATIVE: {
        label: 'Very Sad 😔',
        description: 'Feeling extremely down and hopeless.',
        range: [-1, -0.8],
        statements: [
            "I'm so depressed and hopeless, I don't know what to do.",
            "This is the worst day of my life, everything is going wrong.",
            "I hate my job and my boss is a terrible person.",
        ],
    },
    NEGATIVE: {
        label: 'Sad 😞',
        description: 'Feeling unhappy and frustrated.',
        range: [-0.8, -0.4],
        statements: [
            "I'm feeling really down today, nothing seems to be going right.",
            "I'm so frustrated with this project, it's not turning out as planned.",
            "I'm disappointed in myself for making that mistake.",
        ],
    },
    NEUTRAL: {
        label: 'Neutral 😐',
        description: 'Feeling neither happy nor sad.',
        range: [-0.4, 0.4],
        statements: [
            "I'm just okay, nothing exciting happening today.",
            "I'm feeling a bit meh about this movie, it's not great but not bad either.",
            "I'm just trying to get through the day, no big plans.",
        ],
    },
    POSITIVE: {
        label: 'Happy 🙂',
        description: 'Feeling joyful and content.',
        range: [0.4, 0.8],
        statements: [
            "I'm feeling pretty good today, had a nice breakfast and a good workout.",
            "I'm excited for the weekend, can't wait to relax and have some fun.",
            "I'm proud of myself for finishing that difficult task.",
        ],
    },
    VERY_POSITIVE: {
        label: 'Very Happy 😊',
        description: 'Feeling extremely happy and elated.',
        range: [0.8, 1],
        statements: [
            "I'm on top of the world, everything is going amazing!",
            "I'm so grateful for my wonderful friends and family.",
            "I'm thrilled to be starting this new adventure, it's going to be incredible!",
        ],
    },
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

