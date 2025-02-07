import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import JournalModel from '@/models/journal.schema';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import UserModel from '@/models/user.schema';

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    // Get session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized request!!" },
        { status: 401 }
      );
    }

    // Extract request body
    const { content, date } = await request.json();

    console.log("Content:", content); // ✅ Debugging
    console.log("Date:", date); // ✅ Debugging

    if (!date) {
      return NextResponse.json(
        { message: "Date is missing." },
        { status: 400 }
      );
    }

    if (!content) {
      return NextResponse.json(
        { message: 'Content is required' },
        { status: 400 }
      );
    }

    // Find user
    const existingUser = await UserModel.findOne({ email: session.user.email });
    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found!!" },
        { status: 404 }
      );
    }

    const userID = existingUser._id;

    // Convert date to "dd-mm-yyyy" format
    const gotDate = new Date(date);
    const formattedDate = `${gotDate.getDate().toString().padStart(2, '0')}-${(gotDate.getMonth() + 1).toString().padStart(2, '0')}-${gotDate.getFullYear()}`;

    console.log("Backend formatted date: ", formattedDate);

    // Check if a journal entry already exists for that date
    const existingJournal = await JournalModel.findOne({ date: formattedDate, userID });

    console.log("Existing Journal:", existingJournal); // ✅ Debugging

    if (!existingJournal) {
      // Create a new journal entry
      const newJournal = new JournalModel({
        userID,
        date: formattedDate, // Save formatted date
        content,
      });

      await newJournal.save();

      return NextResponse.json(
        { message: 'Journal entry saved successfully' },
        { status: 201 }
      );
    }

    // Update existing journal entry
    existingJournal.content = content;
    await existingJournal.save();

    return NextResponse.json(
      { message: 'Journal entry updated successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Journal save error:', error);
    return NextResponse.json(
      { message: 'An error occurred while saving the journal' },
      { status: 500 }
    );
  }
}
