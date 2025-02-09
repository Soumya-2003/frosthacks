import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/db";
import FeedbackModel from "@/models/feedback.schema";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/user.schema";

export async function POST(request: NextRequest, response: NextResponse) {
    await dbConnect();

    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();

        const existingUser = await UserModel.findOne({ email: session.user.email });

        if (!existingUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const newFeedback = new FeedbackModel({
            userId: existingUser._id,
            feedback: body.feedback,
            name: body.name,
            email: body.email,
            rating: body.rating
        });

        if(!newFeedback) {
            return NextResponse.json({ message: "Failed to create feedback" }, { status: 500 });
        }

        await newFeedback.save();

        return NextResponse.json({ message: "Feedback created successfully" }, { status: 201 });

    } catch (error) {
        console.log("Error creating feedback: ", error);
        return NextResponse.json({ message: "Failed to create feedback" }, { status: 500 });
    }
}