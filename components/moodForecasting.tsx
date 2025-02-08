'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { motion } from 'motion/react';
import { CustomTooltip } from "./customToolTip";

const moodData = {
    weekly: [
        { date: "Mon", mood: 3 },
        { date: "Tue", mood: 4 },
        { date: "Wed", mood: 2 },
        { date: "Thu", mood: 5 },
        { date: "Fri", mood: 4 },
        { date: "Sat", mood: 5 },
        { date: "Sun", mood: 3 },
    ],
    monthly: [
        { date: "Jan", mood: 3 },
        { date: "Feb", mood: 4 },
        { date: "Mar", mood: 2 },
        { date: "Apr", mood: 5 },
        { date: "May", mood: 4 },
        { date: "Jun", mood: 5 },
    ],
};

export const MoodForecastingChart = () => {
    const [timeRange, setTimeRange] = useState<"weekly" | "monthly">("weekly");

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
        >
            <Card
                className="w-full max-w-7xl mx-auto dark:bg-white/20 bg-black/5 backdrop-blur-md border border-black/20 dark:border-white/10 text-black dark:text-white shadow-lg p-4 rounded-xl"
            >
                <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-2">
                    <CardTitle className="text-xl md:text-2xl font-bold text-center sm:text-left">
                        Mood Forecasting
                    </CardTitle>
                    <Badge className="bg-white text-black dark:bg-white dark:text-black font-semibold px-3 py-2 hover:bg-white dark:hover:bg-gray-800 border border-black dark:border-white">
                        Current Mood: 😊
                    </Badge>
                </CardHeader>
                <CardContent className="p-2 sm:p-4 flex flex-col gap-6">
                    <div className="flex justify-center">
                        <ToggleGroup
                            type="single"
                            value={timeRange}
                            onValueChange={(value) => value && setTimeRange(value as 'weekly' | 'monthly')}
                        >
                            <ToggleGroupItem value="weekly" className="dark:text-white text-black px-3 py-1">
                                Weekly
                            </ToggleGroupItem>
                            <ToggleGroupItem value="monthly" className="dark:text-white text-black px-3 py-1">
                                Monthly
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>
                    <div className="w-full h-64 sm:h-80">
                        <ResponsiveContainer width={"100%"} height={"100%"} className={"p-8"}>
                            <LineChart data={moodData[timeRange]}>
                                <XAxis dataKey={"date"} className="dark:stroke-white stroke-black" />
                                <YAxis domain={[0, 7]} className="dark:stroke-white stroke-black" />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type={"monotone"}
                                    dataKey={"mood"}
                                    stroke="#FFD700"
                                    strokeWidth={3}
                                    dot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
