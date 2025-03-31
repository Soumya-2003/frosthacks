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

    const { username } = await request.json();

    console.log("recieveing content", username);
    // Call the Flask API for sentiment analysis
    const API_BASE_URL = process.env.NEXT_PUBLIC_FLASK_API_URL;
    const flaskApiUrl = `${API_BASE_URL}/twitter-sentiment`;
    const response = await axios.post(flaskApiUrl, { username: username });
    const twitterResults = response.data;

    // Add logic to save the result the sentiment analysis results to the database

    return NextResponse.json(
      {...twitterResults},
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