import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import axios from "axios";
import { getServerSession } from "next-auth";
import UserModel from "@/models/user.schema";
import SentenceAnalysisModel from "@/models/sentenceAnalysis.schema";
import mongoose from "mongoose";

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
        const { promptWords, userResponse } = entry;

        // Call the Flask API for sentiment analysis
        const flaskApiUrl = "http://localhost:5000/analyze-content";
        const response = await axios.post(flaskApiUrl, { content: userResponse });
        const { overall_mood } = response.data;

        // Store in MongoDB
        const newSentenceAnalysis = new SentenceAnalysisModel({
          userID,
          word: promptWords,
          sentence: userResponse,
          mood: overall_mood,
          date: new Date(date),
        });

        await newSentenceAnalysis.save();

        return {
          word: promptWords,
          sentence: userResponse,
          mood: overall_mood,
        };
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
