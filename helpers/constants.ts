const APP_NAME = 'Moodify';
const SUPPORT_EMAIL = "support@moodify.com";

const THANKS_MESSAGE = "Thank you for completing the assessment! Come back again tomorrow 😊"

const motivationalQuotes = [
    "Believe in yourself and all that you are. ✨",
    "You are stronger than you think. 💪",
    "Every day is a fresh start. 🌅",
    "Progress, not perfection. 🔥",
    "Small steps lead to big changes. 🚀",
    "Your only limit is your mind. 🧠",
    "Keep pushing forward, no matter what. 💯",
    "Success starts with self-discipline. 🏆",
    "Dream it. Wish it. Do it. 🌟",
    "Doubt kills more dreams than failure ever will. ⚡",
    "Stay positive, work hard, make it happen. ✅",
    "Make today amazing. 🎯",
    "You got this! 👊",
    "Don't stop until you're proud. 🔥",
    "Turn your pain into power. 💥",
];

const getRandomElement = (array: string[], length: number) => {
    const randomElement = array[Math.floor(Math.random()*length)]

    return randomElement;
}

enum SocialMedia {
    Twitter = "Twitter",
    Instagram = "Instagram",
    Facebook = "Facebook"
}

enum Routes {
    Assessment = "/assessment",
    SocialMediaAnalysis = "/social-media-analysis",
    Journal = "/journal",
    Report = "/reports",
    MoodForcasting = "/mood-forecasting",
    Entertainment = "/entertainment"
}

enum AssessmentOptions {
    ImagePerception = "ImagePerception",
    Questionaire = "Questionaire",
    SentenceFormation = "SentenceFormation"
}

export { 
    APP_NAME,
    SUPPORT_EMAIL,
    THANKS_MESSAGE,
    motivationalQuotes,
    getRandomElement,
    SocialMedia,
    Routes,
    AssessmentOptions
}
