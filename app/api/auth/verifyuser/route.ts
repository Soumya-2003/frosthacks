import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import UserModel from '@/models/user.schema';

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const body = await request.json();
    const { email, otp } = body;

    // Validate required fields
    if (!email || !otp) {
      return NextResponse.json(
        { message: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Find the user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: 'No user found with the provided email' },
        { status: 404 }
      );
    }

    // Check if the OTP matches
    if (user.verifyCode.toString() !== otp.toString()) {
      return NextResponse.json(
        { message: 'Invalid OTP' },
        { status: 401 }
      );
    }

    // Update the user's verification status
    user.isVerified = true;
    user.verifyCode = ""; // Clear the OTP after verification
    await user.save();

    // Return success response
    return NextResponse.json(
      { message: 'Account verified successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { message: 'An error occurred during verification' },
      { status: 500 }
    );
  }
}