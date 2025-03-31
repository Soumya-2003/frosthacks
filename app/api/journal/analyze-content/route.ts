import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import UserModel from '@/models/user.schema';

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    // Ensure user is authenticated
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized Request." },
        { status: 401 }
      );
    }

    // Check if the user exists in the database
    const existingUser = await UserModel.findOne({ email: session.user.email });
    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    // Extract journal content from the request body
    const body = await request.json();
    if (!body || !body.content || body.content.trim() === "") {
      return NextResponse.json(
        { message: "Invalid journal entry. Content cannot be empty." },
        { status: 400 }
      );
    }

    const content = body.content.trim();
    console.log("Received journal content for analysis:", content);

    // Call the Flask API for mood analysis
    const API_BASE_URL = process.env.NEXT_PUBLIC_FLASK_API_URL;

    const flaskApiUrl = `${API_BASE_URL}/analyze-content`;
    let emotionResults;
    try {
      const response = await axios.post(flaskApiUrl, { content: content });
      emotionResults = response.data;

      console.log("Python Flask Response: ", emotionResults);
    } catch (error) {
      console.log("Flask error inside content analysis: ", error);
    }

    // Return the analyzed mood/emotion to the user
    return NextResponse.json(
      { mood: emotionResults.mood, details: emotionResults },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error analyzing journal mood:', error);
    return NextResponse.json(
      { message: 'An error occurred during mood analysis.' },
      { status: 500 }
    );
  }
}
