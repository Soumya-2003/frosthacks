export const calculateMoodScore = (responses: number[]): { moodScore: number; mood: string } => {
    // Define constants for minimum and maximum scores
    const minScore = 7;
    const maxScore = 35;

    // Calculate the total score by summing up all responses
    const totalScore = responses.reduce((sum, value) => sum + value, 0);

    // Normalize the total score to a percentage (0% to 100%)
    const moodScore = ((totalScore - minScore) / (maxScore - minScore)) * 100;

    // Determine the mood category based on the normalized score
    let mood: string;
    if (moodScore <= 20) {
        mood = "Very Negative 😞";
    } else if (moodScore <= 40) {
        mood = "Negative 😕";
    } else if (moodScore <= 60) {
        mood = "Neutral 😐";
    } else if (moodScore <= 80) {
        mood = "Positive 🙂";
    } else {
        mood = "Very Positive 😃";
    }

    // Return the mood score and mood category
    return { moodScore: parseFloat(moodScore.toFixed(2)), mood };
}