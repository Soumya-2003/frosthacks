import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import UserModel from '@/models/user.schema';
import { sendVerificationEmail } from '@/helpers/sendVerificationMail';
import { generateVerifyCode } from '@/helpers/generateVerifyCode';

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const body = await request.json();
    const { email } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
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

    // Generate a new OTP
    const verifyCode = generateVerifyCode();
    await sendVerificationEmail(email, user.username, verifyCode);

    // Save the new OTP in the database
    user.verifyCode = verifyCode;
    await user.save();

    // Return success response
    return NextResponse.json(
      { message: 'Verification email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Resend OTP error:', error);
    return NextResponse.json(
      { message: 'An error occurred while resending the OTP' },
      { status: 500 }
    );
  }
}