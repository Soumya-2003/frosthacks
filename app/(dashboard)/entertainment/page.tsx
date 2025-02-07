'use client'

import { useState } from "react";

const API_URL = "http://localhost:5000/analyze-preferences";

const App = () => {
  const [preferences, setPreferences] = useState([
    { type: "song", name: "Shape of You", genre: "happy-pop" },
    { type: "movie", name: "Titanic", genre: "romance" },
    { type: "game", name: "Call of Duty", genre: "fps" },
  ]);
  
  const [report, setReport] = useState("");

  const analyzePreferences = async () => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preferences }),
    });
    const data = await response.json();
    setReport(data.report);
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>🎭 Entertainment Preferences</h2>
      
      <h3>Your Selections:</h3>
      <ul>
        {preferences.map((item, index) => (
          <li key={index}>{item.type} - {item.name} ({item.genre})</li>
        ))}
      </ul>

      <button onClick={analyzePreferences}>Analyze Preferences</button>
      
      {report && <p style={{ marginTop: "20px", fontSize: "18px" }}>{report}</p>}
    </div>
  );
};

export default App;
