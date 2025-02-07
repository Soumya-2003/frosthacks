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

    // Retrieve the last 7 days of journal entries for the user
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const userID = existingUser._id;

    const journals = await JournalModel.find({
      userID,
      date: { $gte: sevenDaysAgo },
    }).sort({ date: 1 });

    

    if (!journals || journals.length === 0) {
      return NextResponse.json(
        { message: 'No journal entries found in the last 7 days' },
        { status: 404 }
      );
    }

    const journalEntries: { [key: string]: string } = {};
    journals.forEach((journal, index) => {
      journalEntries[`Day ${index + 1}`] = journal.content;
    });

    

    // Call the Flask API for sentiment analysis
    const flaskApiUrl = 'http://localhost:5001/analyze';
    const response = await axios.post(flaskApiUrl, { journal_entries: journalEntries });
    const emotionResults = response.data;

    // Save the sentiment analysis results to the database
    const newSentiment = new SentimentModel({
      userID,
      results: emotionResults,
    });

    await newSentiment.save();

    return NextResponse.json(
      { message: 'Emotion analysis completed successfully', results: emotionResults },
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