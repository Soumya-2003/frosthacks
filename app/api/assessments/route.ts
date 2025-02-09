import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import AssessmentModel from '@/models/assessment.schema';
import { getServerSession } from 'next-auth';
import axios from 'axios';
import { authOptions } from '../auth/[...nextauth]/options';
import { calculateMoodScore } from '@/helpers/calculatedMood';

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
    const responses = await request.json();

    console.log("Data from frontend: ", responses);

    // Validate responses
    if (!Array.isArray(responses) || responses.length !== 7 || !responses.every(r => r >= 1 && r <= 7)) {
      return NextResponse.json(
        { message: 'Invalid responses. Expected a list of 7 integers between 1 and 7.' },
        { status: 400 }
      );
    }

    //Call the mood calclulation function
    const response = calculateMoodScore(responses);
    const { moodScore, mood } = response;

    // Convert current date to "dd-mm-yyyy" format
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;

    const existingAssessment = await AssessmentModel.findOne({
      userID,
      date: formattedDate,
    });

    if (existingAssessment) {
      // Update the existing assessment
      existingAssessment.responses = responses;
      existingAssessment.moodScore = moodScore;
      existingAssessment.mood = mood;
      await existingAssessment.save();
    }
    else {
      // Save the assessment to the database
      const newAssessment = new AssessmentModel({
        userID,
        responses,
        moodScore,
        mood,
        date: today
      });

      await newAssessment.save();

    }

    // Return the results
    return NextResponse.json(
      { message: 'Assessment submitted successfully', moodScore, mood },
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