import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import JournalModel from '@/models/journal.schema';
import { getServerSession } from 'next-auth';
import UserModel from '@/models/user.schema';
import { authOptions } from '../../auth/[...nextauth]/options';
import mongoose from 'mongoose';

// New GET endpoint to view journal content for a specific date
export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    // Authenticate the user
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized request!!" },
        { status: 401 }
      );
    }

    console.log("Session User: ", session.user);

    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { message: 'Date is required' },
        { status: 400 }
      );
    }

    const existingUser = await UserModel.findOne({
      email: session.user.email,
    });

    if (!existingUser) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );    
    }

    // Convert input date to "DD-MM-YYYY"
    const gotDate = new Date(date);
    if (isNaN(gotDate.getTime())) {
      return NextResponse.json(
        { message: "Invalid date format." },
        { status: 400 }
      );
    }

    const formattedDate = `${gotDate.getDate().toString().padStart(2, '0')}-${(gotDate.getMonth() + 1).toString().padStart(2, '0')}-${gotDate.getFullYear()}`;

    console.log("Formatted Date: ", formattedDate);

    console.log("Session user Id: ", existingUser._id);

    // Find the journal entry for the specified user and date
    const journalEntry = await JournalModel.findOne({
      userID: existingUser._id,
      date: formattedDate,
    });

    if (!journalEntry) {
      return NextResponse.json(
        { message: 'No journal entry found for the specified date.' },
        { status: 200 }
      );
    }

    // Return the journal content
    return NextResponse.json(
      {
        message: 'Journal entry retrieved successfully',
        content: journalEntry.content,
        date: journalEntry.date, // Already stored as "DD-MM-YYYY"
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Journal retrieval error:', error);
    return NextResponse.json(
      { message: 'An error occurred while retrieving the journal' },
      { status: 500 }
    );
  }
}
