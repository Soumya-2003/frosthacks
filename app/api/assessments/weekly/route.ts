import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import AssessmentModel from '@/models/assessment.schema';
import { getServerSession } from 'next-auth';
import axios from 'axios';
import { authOptions } from '../../auth/[...nextauth]/options';
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
        const { current_date } = await request.json();

        // Convert current date to "dd-mm-yyyy" format
        const sevenDaysAgo = new Date(current_date);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const formattedDate = `${sevenDaysAgo.getDate().toString().padStart(2, '0')}-${(sevenDaysAgo.getMonth() + 1).toString().padStart(2, '0')}-${sevenDaysAgo.getFullYear()}`;

        const assessments = await AssessmentModel.find({
            userID,
            date: { $gte: formattedDate },
        }).sort({ date: 1 });

        if (!assessments || assessments.length === 0) {
            return NextResponse.json(
                { message: 'No assessments entries found in the last 7 days' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Last 7 days results', results: assessments },
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