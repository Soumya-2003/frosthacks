import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import AssessmentModel from '@/models/assessment.schema';
import { getServerSession } from 'next-auth';
import axios from 'axios';
import { authOptions } from '../auth/[...nextauth]/options';

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    // Get the session using getServerSession
    const session = await getServerSession(authOptions);

    // Check if the user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized request!!" },
        { status: 401 }
      );
    }

    // Extract the user ID from the session
    const userID = session.user._id; // Assuming the user ID is stored in session.user.id

    // Parse the input JSON
    const data = await request.json();
    const { responses } = data;

    // Validate responses
    if (!Array.isArray(responses) || responses.length !== 7 || !responses.every(r => r >= 1 && r <= 7)) {
      return NextResponse.json(
        { message: 'Invalid responses. Expected a list of 7 integers between 1 and 7.' },
        { status: 400 }
      );
    }

    // Call the Flask API for mood analysis
    const flaskApiUrl = 'http://localhost:5002/analyze-mood';
    const response = await axios.post(flaskApiUrl, { responses });
    const { mood_score, mood } = response.data;

    // Save the assessment to the database
    const newAssessment = new AssessmentModel({
      userID,
      responses,
      mood_score,
      mood,
    });

    await newAssessment.save();

    // Return the results
    return NextResponse.json(
      { message: 'Assessment submitted successfully', mood_score, mood },
      { status: 200 }
    );
  } catch (error) {
    console.error('Assessment error:', error);
    return NextResponse.json(
      { message: 'An error occurred while processing the assessment' },
      { status: 500 }
    );
  }
}