"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Gift } from "lucide-react";

const rewards = [
    "50 Coins 🎉",
    "XP Boost 🚀",
    "Mystery Box 🎁",
    "Exclusive Avatar 🧑‍🎨",
    "Discount Coupon 💸",
    "Double Reward Day 🔥",
    "Mega Jackpot 🎊"
];

export default function DailyLoginReward({ day }: { day: number }) {
    const [open, setOpen] = useState(true);
    const reward = rewards[day - 1];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl border dark:border-gray-700 p-6">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                        <Gift className="text-yellow-500" /> Daily Login Reward!
                    </DialogTitle>
                </DialogHeader>

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="text-center"
                >
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                        🎁 Congratulations! You have unlocked:
                    </p>
                    <motion.p
                        className="text-2xl font-bold mt-2 text-blue-600 dark:text-yellow-400"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1.1 }}
                        transition={{ yoyo: Infinity, duration: 0.6 }}
                    >
                        {reward}
                    </motion.p>
                </motion.div>

                <Button
                    onClick={() => setOpen(false)}
                    className="w-full mt-4 bg-blue-600 dark:bg-yellow-400 text-white dark:text-black font-semibold py-2 rounded-lg transition hover:bg-blue-700 dark:hover:bg-yellow-500"
                >
                    Continue
                </Button>
            </DialogContent>
        </Dialog>
    );
}
