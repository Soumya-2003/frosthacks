import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import UserModel from '@/models/user.schema';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const body = await request.json();
    const { identifier, password } = body;

    // Validate required fields
    if (!identifier || !password) {
      return NextResponse.json(
        { message: 'Email/Username and password are required' },
        { status: 400 }
      );
    }

    // Find the user by email or username
    const user = await UserModel.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      return NextResponse.json(
        { message: 'No user found with the provided credentials' },
        { status: 404 }
      );
    }

    // Compare passwords
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: 'Incorrect password' },
        { status: 401 }
      );
    }

    // Generate a JWT token
    const userId = user._id as unknown as string;
    const token = generateJwtToken(userId);

    // Return success response
    return NextResponse.json(
      {
        message: 'Login successful',
        user: {
          username: user.username,
          email: user.email,
        },
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Sign-in error:', error);
    return NextResponse.json(
      { message: 'An error occurred during sign-in' },
      { status: 500 }
    );
  }
}

// Helper function to generate a JWT token
function generateJwtToken(userId: string): string {
  const secret = process.env.JWT_SECRET || 'default-secret';
  return jwt.sign({ userId }, secret, { expiresIn: '1h' });
}