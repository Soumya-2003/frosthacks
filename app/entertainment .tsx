import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";

// Dummy Data for Challenges & Quizzes
const challenges = [
  "Describe your mood in one word!",
  "React to this image with an emoji! 😊😢😡",
  "Write a short positive affirmation for today!",
];

const quizzes = [
  { question: "What color represents your mood today?", options: ["Red", "Blue", "Green", "Yellow"] },
  { question: "Which word best describes your current state?", options: ["Happy", "Calm", "Tired", "Anxious"] },
];

export default function EntertainmentSection() {
  const [challenge, setChallenge] = useState("");
  const [quiz, setQuiz] = useState({});
  const [chatbotResponse, setChatbotResponse] = useState("");
  const [userMessage, setUserMessage] = useState("");

  // Load random challenge & quiz on component mount
  useEffect(() => {
    setChallenge(challenges[Math.floor(Math.random() * challenges.length)]);
    setQuiz(quizzes[Math.floor(Math.random() * quizzes.length)]);
  }, []);

  // Dummy AI chatbot function
  const handleChat = () => {
    const responses = ["You're doing great! 😊", "Stay positive and keep going! 💪", "I'm here to chat with you! 🤖"];
    setChatbotResponse(responses[Math.floor(Math.random() * responses.length)]);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">🎮 Entertainment Section 🎭</h1>

      {/* Challenge of the Day */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold">🔥 Daily Challenge</h2>
          <p className="mt-2">{challenge}</p>
          <Button className="mt-4">Submit Response</Button>
        </CardContent>
      </Card>

      {/* Mood Quiz */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold">📝 Mood Quiz</h2>
          <p className="mt-2">{quiz.question}</p>
          <div className="mt-3">
            {quiz.options?.map((option, index) => (
              <Button key={index} className="mr-2">{option}</Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Chatbot */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold">🤖 AI Mood Companion</h2>
          <p className="mt-2">Chat with our AI to get mood-boosting messages!</p>
          <div className="mt-3">
            <Input
              type="text"
              placeholder="Type a message..."
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
            />
            <Button className="mt-2" onClick={handleChat}>Send</Button>
          </div>
          {chatbotResponse && <p className="mt-3 text-green-600">{chatbotResponse}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
