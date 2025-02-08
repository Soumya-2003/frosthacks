import dbConnect from "@/lib/db";
import UserModel from "@/models/user.schema";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req: NextRequest) {
    try {
        await dbConnect(); // Ensure MongoDB is connected

        const session = await getServerSession(authOptions);
        if (!session) {
            console.log("🔴 Unauthorized: No session found");
            return NextResponse.json({ message: "Unauthorized request!!" }, { status: 400 });
        }

        const currUser = session?.user;
        console.log("🔵 Current User:", currUser);

        if (!currUser || !currUser.email) {
            console.log("🔴 Error: No email in session user");
            return NextResponse.json({ message: "User email not found!" }, { status: 400 });
        }

        // Find the user
        let user = await UserModel.findOne({ email: currUser.email });

        if (!user) {
            console.log("🔴 Error: User not found in DB");
            return NextResponse.json({ message: "User not found!!" }, { status: 404 });
        }

        console.log("🟢 Found user:", user);

        // Ensure loginHistory exists
        if (!user.loginHistory) {
            console.log("🟠 loginHistory was undefined, initializing...");
            user.loginHistory = [];
        }

        // Get today's date
        const today = dayjs().format("YYYY-MM-DD");

        // Debug: Check existing loginHistory
        console.log("🔵 Existing loginHistory:", user.loginHistory);

        // Check if already logged in today
        const alreadyLoggedIn = user.loginHistory.some((entry) => entry.date === today);
        if (alreadyLoggedIn) {
            console.log("🟠 User already logged in today.");
            return NextResponse.json({ message: "Already logged in today" }, { status: 400 });
        }

        // Add today's login entry
        user.loginHistory.push({ date: today });

        // Debug: Check updated loginHistory
        console.log("🟢 Updated loginHistory:", user.loginHistory);

        // Save the user document
        await user.save();
        console.log("✅ Successfully saved user login");

        return NextResponse.json({ message: "Daily login recorded!" }, { status: 200 });

    } catch (error) {
        console.error("🔴 Error recording login:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
