

const getEmoji = (mood: number) => {
    if (mood >= 5) return "😄";  // Happy
    if (mood === 4) return "🙂";  // Neutral
    if (mood === 3) return "😐";  // Neutral/Okay
    if (mood === 2) return "🙁";  // Sad
    return "😢";  // Very Sad
};

export const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const mood = payload[0].value;
        return (
            <div
                className="bg-black text-white p-2 rounded-lg shadow-lg flex flex-col items-center"
                style={{ opacity: 0.8 }}
            >
                <div className="text-lg">{mood}</div>
                <div className="text-3xl">{getEmoji(mood)}</div>
            </div>
        );
    }
    return null;
};
