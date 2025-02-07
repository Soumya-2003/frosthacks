import * as React from "react";
import { Html, Head, Body, Container, Text, Link, Heading, Button, Tailwind } from "@react-email/components";
import { APP_NAME, SUPPORT_EMAIL } from "@/helpers/constants";

interface EmailVerificationProps {
    username: string;
    otp: string;
}

const EmailVerification: React.FC<Readonly<EmailVerificationProps>> = ({ username, otp }) => {
    return (
        <Html>
            <Head />
            <Tailwind>
                <Body className="bg-gray-100 text-gray-900">
                    <Container className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6">
                        <Heading className="text-2xl font-bold text-center text-blue-600">Welcome to {APP_NAME}!</Heading>
                        <Text className="text-lg text-center">Hello {username},</Text>
                        <Text className="text-center">
                            Thank you for signing up! Please verify your email address by clicking the button below.
                        </Text>
                        <Text className="text-center mt-4 text-lg font-medium text-gray-800">
                            Your One-Time Password (OTP) is:
                        </Text>
                        <Text className="text-center text-2xl font-bold text-blue-600">
                            {otp}
                        </Text>
                        <Text className="text-sm text-gray-600 text-center mt-4">
                            If you didn’t request this, please ignore this email.
                        </Text>
                        <Text className="text-sm text-gray-600 text-center">
                            Need help? Contact us at{" "}
                            <Link href={`mailto:${SUPPORT_EMAIL}`} className="text-blue-600">
                            </Link>
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default EmailVerification;
