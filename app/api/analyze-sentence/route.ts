import { mood } from '@/assets/assets';
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import axios from "axios";
import { getServerSession } from "next-auth";
import UserModel from "@/models/user.schema";
import SentenceAnalysisModel from "@/models/sentenceAnalysis.schema";
import mongoose from "mongoose";

const API_BASE_URL = process.env.NEXT_PUBLIC_FLASK_API_URL;

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized Request." },
        { status: 401 }
      );
    }

    const existingUser = await UserModel.findOne({ email: session.user.email });

    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    const userID = existingUser._id;

    const { date, responses } = await request.json();

    if (!responses || !Array.isArray(responses) || responses.length === 0) {
      return NextResponse.json(
        { error: "Invalid input. Expected an array of responses." },
        { status: 400 }
      );
    }

    // Process each sentence for analysis
    const analyzedResponses = await Promise.all(
      responses.map(async (entry) => {
        try {
          const { promptWords, userResponse } = entry;

          console.log("Prompt Words:", promptWords);
          console.log("User Response:", userResponse);

          // Call the Flask API for sentiment analysis
          const flaskApiUrl = `${API_BASE_URL}/analyze-sentence`;
          const response = await axios.post(flaskApiUrl, { sentence: userResponse, word: promptWords });
          console.log("Flask API Response:", response.data);
          const { overall_mood, word, content } = response.data;

          if (!overall_mood || !word || !content) {
            return NextResponse.json({ message: "An error occurred during emotion analysis" }, { status: 500 });
          }

          console.log("Overall Mood:", overall_mood);
          console.log("Word:", word);
          console.log("Content:", content);

          // Store in MongoDB
          const newSentenceAnalysis = new SentenceAnalysisModel({
            userID,
            word: promptWords,
            sentence: userResponse,
            mood: overall_mood,
            date: new Date(date),
          });

          if (!newSentenceAnalysis) {
            return NextResponse.json({ message: "An error occurred during emotion analysis model creation." }, { status: 400 });
          }

          await newSentenceAnalysis.save();

          return {
            word: promptWords,
            sentence: userResponse,
            mood: overall_mood,
            date: new Date(date),
          };
        } catch (error) {
          return NextResponse.json({ message: "An error occurred during emotion analysis" }, { status: 500 });
        }

      })
    );

    return NextResponse.json(
      { message: "Sentences analyzed successfully", data: analyzedResponses },
      { status: 200 }
    );
  } catch (error) {
    console.error("Sentiment analysis error:", error);
    return NextResponse.json(
      { message: "An error occurred during emotion analysis" },
      { status: 500 }
    );
  }
}
