import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const entertainmentOptions = {
  songs: [
    { name: "Happy - Pharrell Williams", emotion: "Happy", weight: 0.9 },
    { name: "Someone Like You - Adele", emotion: "Sad", weight: 0.8 },
    { name: "Eye of the Tiger - Survivor", emotion: "Motivational", weight: 0.85 },
  ],
  movies: [
    { name: "The Pursuit of Happyness", emotion: "Inspiring", weight: 0.9 },
    { name: "Joker", emotion: "Dark", weight: 0.7 },
    { name: "Avengers: Endgame", emotion: "Exciting", weight: 0.85 },
  ],
  games: [
    { name: "The Last of Us", emotion: "Emotional", weight: 0.8 },
    { name: "FIFA 23", emotion: "Energetic", weight: 0.9 },
    { name: "Dark Souls", emotion: "Challenging", weight: 0.85 },
  ],
};

export default function EntertainmentPreferences() {
  const [selectedItems, setSelectedItems] = useState({ songs: [], movies: [], games: [] });
  const [report, setReport] = useState(null);

  // Function to handle user selection
  const handleSelect = (category, item) => {
    setSelectedItems((prev) => ({
      ...prev,
      [category]: prev[category].includes(item)
        ? prev[category].filter((i) => i !== item)
        : [...prev[category], item],
    }));
  };

  // Function to calculate emotional impact score
  const generateReport = () => {
    let emotionScores = {};

    Object.keys(selectedItems).forEach((category) => {
      selectedItems[category].forEach((item) => {
        const found = entertainmentOptions[category].find((i) => i.name === item);
        if (found) {
          emotionScores[found.emotion] = (emotionScores[found.emotion] || 0) + found.weight;
        }
      });
    });

    setReport(emotionScores);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">🎭 Entertainment Preferences</h1>

      {/* Selection UI */}
      {Object.keys(entertainmentOptions).map((category) => (
        <Card key={category} className="mb-6">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold">{category.toUpperCase()}</h2>
            {entertainmentOptions[category].map((item) => (
              <Button
                key={item.name}
                onClick={() => handleSelect(category, item.name)}
                className={`mr-2 mt-2 ${selectedItems[category].includes(item.name) ? "bg-blue-500 text-white" : ""}`}
              >
                {item.name}
              </Button>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* Generate Report Button */}
      <Button className="w-full mt-4 bg-green-500 text-white" onClick={generateReport}>
        📊 Generate Emotional Impact Report
      </Button>

      {/* Display Emotional Impact Report */}
      {report && (
        <Card className="mt-6">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold">📝 Emotional Impact Report</h2>
            <ul className="mt-3">
              {Object.entries(report).map(([emotion, score]) => (
                <li key={emotion} className="mt-2">
                  <strong>{emotion}:</strong> {Math.round(score * 100)}%
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
