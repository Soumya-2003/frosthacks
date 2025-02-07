import EmailVerification from "@/components/emailComponent";
import { NextResponse } from "next/server";
import { Resend } from 'resend'
import { APP_NAME } from "./constants";


const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
    email: string,
    username: string,
    otp: string,
): Promise<NextResponse> {
    try {
        const result = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: `${APP_NAME} | Account Verification`,
            text: "Your verificaton code is: " + otp,
            react: await EmailVerification({ username, otp })
        })

        console.log(result);

        if (result.data) {
            return NextResponse.json({
                success: true,
                message: `Email successfully send to ${email}.`
            },
                {
                    status: 200
                }
            )
        }

        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong!!",
            },
            {
                status: 500
            }
        )

    } catch (error) {
        return NextResponse.json(
            {
                error
            },
            {
                status: 500
            }
        )
    }
}