"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";

export default function EntertainmentPreferences() {
  const [song, setSong] = useState("");
  const [movie, setMovie] = useState("");
  const [game, setGame] = useState("");

  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [emotionTags, setEmotionTags] = useState(["Relaxing 🎵", "Exciting 🎮", "Thrilling 🎬"]);

  // Mock emotional impact data for radar chart
  const data = [
    { emotion: "Calm", value: 80 },
    { emotion: "Exciting", value: 60 },
    { emotion: "Anxiety", value: 30 },
    { emotion: "Joyful", value: 75 },
    { emotion: "Dramatic", value: 50 },
  ];

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      {/* Header Section */}
      <header className="w-full flex justify-between items-center p-4 bg-white dark:bg-gray-900 shadow-md">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Entertainment Preferences</h1>
      </header>

      {/* Main Content Section */}
      <div className="flex flex-1 flex-col md:flex-row p-6 gap-6">
        {/* Left Section: Input Fields */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <Card className="w-full p-14 space-y-6 bg-white dark:bg-black shadow-lg rounded-2xl">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mb-4">
              <Label className="text-black dark:text-gray-300">Favorite Song</Label>
              <Input
                placeholder="Search for a song..."
                className="w-full bg-gray-100 dark:bg-gray-900 p-4 py-6 rounded-xl text-lg"
                value={song}
                onChange={(e) => setSong(e.target.value)}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.3 }} className="mb-4">
            <Label className="text-black dark:text-gray-300">Favorite Movie</Label>
              <Input
                placeholder="Search for a movie..."
                className="w-full bg-gray-100 dark:bg-gray-900 p-4 py-6 rounded-xl text-lg"
                value={movie}
                onChange={(e) => setMovie(e.target.value)}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.3 }} className="mb-4">
            <Label className="text-black dark:text-gray-300">Favorite Game</Label>
              <Input
                placeholder="Search for a game..."
                className="w-full bg-gray-100 dark:bg-gray-900 p-4 py-6 rounded-xl text-lg"
                value={game}
                onChange={(e) => setGame(e.target.value)}
              />
            </motion.div>

            <Button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg w-full text-lg">
              Analyze Preferences
            </Button>
          </Card>

          {/* Emotion Tags */}
          <div className="flex flex-wrap gap-3 p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
            {emotionTags.map((tag, index) => (
              <Badge key={index} className="bg-blue-500 text-white px-4 py-2 rounded-full text-lg">{tag}</Badge>
            ))}
          </div>
        </div>

        {/* Right Section: Report & Insights */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <Card className="w-full p-6 bg-white dark:bg-gray-800 shadow-lg rounded-2xl">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Emotional Impact Report</h2>

            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="emotion" />
                  <Radar name="Emotional Impact" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>

            <div className="mt-4 bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Insights</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your choices indicate a balance between relaxation 🎵 and excitement 🎮. Try adding more calming movies for better mental balance!
              </p>
            </div>
          </Card>

          {/* Suggestions */}
          <Card className="w-full p-6 bg-white dark:bg-gray-800 shadow-lg rounded-2xl">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Suggestions</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Based on your preferences, consider watching more calming movies 🎥 or listening to soothing music 🎶 to help reduce stress.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}