import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import JournalModel from '@/models/journal.schema';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import UserModel from '@/models/user.schema';

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    
    const sesssion = await getServerSession(authOptions)

    if(!sesssion){
      return NextResponse.json(
        {
          message: "Unauthorized request!!",
        },
        {
          status: 401
        }
      )
    }

    const { content, date } = await request.json();

    if(!date){
      return NextResponse.json(
        {
          message: "Date is missing."
        },
        {
          status: 400
        }
      )
    }

    if (!content) {
      return NextResponse.json(
        { message: 'Content is required' },
        { status: 400 }
      );
    }

    const existingUser = await UserModel.findOne({email: sesssion.user.email})

    if(!existingUser){
      return NextResponse.json(
        {
          message: "User not found!!",
        },
        {
          status: 404
        }
      )
    }

    const userID = existingUser._id

    // Create a new journal entry
    const newJournal = new JournalModel({
      userID,
      date,
      content,
    });

    await newJournal.save();

    // Return success response
    return NextResponse.json(
      { message: 'Journal entry saved successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Journal save error:', error);
    return NextResponse.json(
      { message: 'An error occurred while saving the journal' },
      { status: 500 }
    );
  }
}