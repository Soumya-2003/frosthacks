"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

export default function ProfileCard() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return (
            <div className="flex justify-center items-center min-h-screen text-gray-500 dark:text-gray-400">
                Loading...
            </div>
        );
    }

    if (!session) {
        return (
            <div className="flex justify-center items-center min-h-screen text-red-500">
                Unauthorized. Please log in.
            </div>
        );
    }

    const user = session.user;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center items-center min-h-screen"
        >
            <Card className="w-full max-w-lg p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="flex flex-col items-center gap-4">
                    {/* Profile Image */}
                    <Avatar className="w-32 h-32 border-4 border-primary">
                        <AvatarImage src={user.image || "/default-avatar.png"} alt={user.name || "User"} />
                        <AvatarFallback>{user.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>

                    {/* User Info */}
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{user.name}</h2>
                        <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
