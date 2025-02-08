'use client';

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ComingSoonPage = () => {
    const [email, setEmail] = useState("");
    const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const targetDate = new Date("2025-03-01T00:00:00");
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const difference = targetDate.getTime() - now;

            if (difference <= 0) {
                clearInterval(interval);
                return;
            }

            setTimeLeft({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((difference % (1000 * 60)) / 1000),
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center bg-gradient-to-br from-indigo-500 to-purple-700 text-white">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <h1 className="text-4xl md:text-6xl font-extrabold">🚀 Coming Soon!</h1>
                <p className="mt-4 text-lg md:text-xl text-gray-200">We are working on something amazing. Stay tuned! 🔥</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>
                <div className="flex space-x-4 mt-6 text-2xl md:text-3xl font-bold">
                    <div>{timeLeft.days}d</div>
                    <div>{timeLeft.hours}h</div>
                    <div>{timeLeft.minutes}m</div>
                    <div>{timeLeft.seconds}s</div>
                </div>
            </motion.div>

            <Card className="mt-6 p-6 bg-white/10 backdrop-blur-md rounded-xl shadow-lg w-full max-w-lg">
                <h2 className="text-xl md:text-2xl font-bold mb-3">Get Notified</h2>
                <div className="flex space-x-2">
                    <Input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="text-black" />
                    <Button className="bg-white text-indigo-600 hover:bg-gray-200 transition">Notify Me</Button>
                </div>
            </Card>
        </div>
    );
};

export default ComingSoonPage;
