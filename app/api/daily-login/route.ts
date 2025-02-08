// api to record daily logins
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import UserModel from '@/models/user.schema';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import dayjs from 'dayjs';

export async function POST(req: Request) {
    try {
        await dbConnect(); // Ensure MongoDB is connected

        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized request!" }, { status: 400 });
        }

        const currUser = session?.user; // Assuming the user ID is stored in session.user.id
        const user = await UserModel.findOne({ email: currUser.email });

        if (!user) {
            return NextResponse.json({ message: "User not found." }, { status: 404 });
        }

        if (!user.loginHistory) {
            user.loginHistory = [];
        }

        const today = new Date();
        const loginEntry = dayjs(today).format("YYYY-MM-DD");
        user.loginHistory.push(loginEntry);

        await user.save();

        console.log("Updated user: ", user);

        return NextResponse.json({ message: "Login recorded successfully." }, { status: 200 });
    } catch (error) {
        console.error("Error recording login:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}