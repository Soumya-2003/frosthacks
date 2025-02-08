import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import JournalModel from '@/models/journal.schema';
import SentimentModel from '@/models/sentiment.schema';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import UserModel from '@/models/user.schema';

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const session = await getServerSession();

    if(!session){
      return NextResponse.json(
        {
          message: "Unauthorized Request.",
        },
        {
          status: 401
        }
      )
    }

    const existingUser = await UserModel.findOne({
      email: session.user.email
    })

    if(!existingUser){
      return NextResponse.json(
        {
          message: "User not found."
        },
        {
          status: 404
        }
      )
    }

    const userID = existingUser._id;

    const { content } = await request.json();

    console.log("recieveing content", content);
    // Call the Flask API for sentiment analysis
    const flaskApiUrl = 'http://localhost:5000/analyze-content';
    let emotionResults;
    try {
      const response = await axios.post(flaskApiUrl, { content: content });
      emotionResults = response.data;

      console.log("Python Flask Response: ", emotionResults);
    } catch (error) {
      console.log("Flask error inside content analysis: ", error);
    }

    // Add logic to save the result the sentiment analysis results to the database

    return NextResponse.json(
      {...emotionResults},
      { status: 200 }
    );
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    return NextResponse.json(
      { message: 'An error occurred during emotion analysis' },
      { status: 500 }
    );
  }
}