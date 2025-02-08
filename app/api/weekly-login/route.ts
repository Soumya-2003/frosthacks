import dbConnect from "@/lib/db";
import UserModel from "@/models/user.schema";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dayjs from "dayjs";

export async function GET(req: NextRequest) {
    try {
        await dbConnect(); // Ensure MongoDB is connected

        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized request!" }, { status: 400 });
        }

        const currUser = session?.user;
        const user = await UserModel.findOne({ email: currUser.email });

        if (!user) {
            return NextResponse.json({ message: "User not found." }, { status: 404 });
        }

        if(!user.loginHistory){
            return NextResponse.json({ message: "Login history not found." },{status: 404})
        }

        // Get the date 7 days ago
        const sevenDaysAgo = dayjs().subtract(7, "days").format("YYYY-MM-DD");

        // Count logins in the last 7 days
        const weeklyLoginCount = user.loginHistory.filter(entry => entry.date >= sevenDaysAgo).length;

        return NextResponse.json({ weeklyLoginCount }, { status: 200 });
    } catch (error) {
        console.error("Error fetching weekly logins:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
