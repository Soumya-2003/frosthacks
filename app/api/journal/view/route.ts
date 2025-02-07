import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import JournalModel from '@/models/journal.schema';
import { getServerSession } from 'next-auth';
import UserModel from '@/models/user.schema';
import { authOptions } from '../../auth/[...nextauth]/options';

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

    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { message: 'Date is required' },
        { status: 400 }
      );
    }

    const currentDate = new Date(date);

    const startOfTheDay = currentDate.setHours(0,0,0,0);
    const endOfTheDay = currentDate.setHours(23,59,59,999);

    // Find the journal entry for the specified user and date
    const journalEntry = await JournalModel.findOne({ userID: session.user._id, date: { $gte: startOfTheDay, $lte: endOfTheDay } });

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
        date: journalEntry.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
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