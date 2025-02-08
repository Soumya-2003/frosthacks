import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import UserModel from '@/models/user.schema';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import cloudinary from '@/lib/cloudinary';
import { getRandomUsername } from '@/helpers/generateRandomUsername';
import { sendVerificationEmail } from '@/helpers/sendVerificationMail';
import dayjs from 'dayjs';

const DEFAULT_PROFILE_PICTURE = "https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png";

// Connect to MongoDB
export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const {
      username,
      email,
      password,
      age,
      gender
    } = await request.json();

    console.log("data", username, email, password, age, gender);


    // Validate required fields
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: 'Username, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 409 }
      );
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Upload profile picture to Cloudinary
    // let profilePictureUrl = DEFAULT_PROFILE_PICTURE;
    // if (profilePictureFile !== null) {
    //   const uploadedImageUrl = await uploadToCloudinary(profilePictureFile);
    //   if (uploadedImageUrl) profilePictureUrl = uploadedImageUrl;
    // }

    const date = new Date();
    const formattedDate = dayjs(date).format('YYYY-MM-DD');

    console.log("Date: ",formattedDate);


    // Create a new user
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      role: "user",
      age,
      gender,
      profilePicture: "",
      loginHistory: [formattedDate],
    });

    await newUser.save();
    const userId = newUser._id as unknown as string;

    console.log("New User: ",newUser);

    // Generate a JWT token
    const token = generateJwtToken(userId);

    // Return success response
    return NextResponse.json(
      {
        message: 'User registered successfully',
        user: {
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
          age: newUser.age,
          gender: newUser.gender,
          profilePicture: newUser.profilePicture,
        },
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Sign up error: ',error);
    return NextResponse.json(
      { message: error },
      { status: 500 }
    );
  }
}

// Helper function to generate a JWT token
function generateJwtToken(userId: string): string {
  const secret = process.env.JWT_SECRET || 'default-secret';
  return jwt.sign({ userId }, secret, { expiresIn: '1h' });
}

// Helper function to generate a random verification token
function generateVerificationToken(): string {
  return Math.random().toString(36).substring(2, 15); // Random alphanumeric string
}

// Helper function to generate a random 6-digit verification code
function generateVerifyCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit numeric code
}

// Helper function to upload image to Cloudinary
async function uploadToCloudinary(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;

  try {
    const response = await cloudinary.uploader.upload(base64Image, {
      folder: 'profile_pictures',
      resource_type: 'image',
      use_filename: true,
      unique_filename: false,
    });
    return response.secure_url; // Cloudinary URL
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw new Error('Cloudinary upload failed.');
  }
}