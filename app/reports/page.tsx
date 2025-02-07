'use client'

import React, { useState, useEffect } from 'react';
import WeekControls from '@/components/reports/weeksControl';
import ChartContainer from '@/components/reports/chartContainer';
import LoadingSpinner from '@/components/loadingSpinner';
import ErrorMessage from '@/components/errorMessage';
import { usePDF } from 'react-to-pdf';
import { motion } from "motion/react";
import { Button } from '@/components/ui/button';
import { poppins } from "@/helpers/fonts";
import { cn } from "@/lib/utils";
import { formatWeek } from '@/lib/utils';
import { APP_NAME } from '@/helpers/constants';
import axios from 'axios';
import { Card } from '@/components/ui/card';
import { useSession } from 'next-auth/react';

interface ApiResponse {
    success: boolean;
    data: DayData[];
}

interface DayData {
    day: string;
    traits: Trait[];
}

interface Trait {
    value: number;
    label: string;
    fill: string;
    index: number;
}

interface EmotionResults {
    overall_mood: string;
    overall_emotions: {
        happy: number;
        sad: number;
        anxious: number;
        depressed: number;
    };
}

const ReportPage: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<DayData[]>([]);
    const { toPDF, targetRef } = usePDF({ filename: `Moodify Report ${formatWeek(currentDate)}.pdf` });
    const [journalAnalysis, setJournalAnalysis] = useState<EmotionResults | null>(null)
    const { data: session } = useSession();

    useEffect(() => {
        updateWeekDisplay();
    }, [currentDate]);

    const updateWeekDisplay = () => {
        fetchWeeklyDataAndDraw(currentDate);
    };

    const fetchWeeklyDataAndDraw = async (date: Date) => {
        setLoading(true);
        setError(null);
        setData([]);

        // Simulated API Response
        const apiResponse = {
            "success": true,
            "data": [
                {
                    "day": "Monday",
                    "traits": [
                        { "value": 45, "label": "Happiness", "fill": "#FFD700", "index": 0.1 },
                        { "value": 67, "label": "Sadness", "fill": "#87CEEB", "index": 0.2 },
                        { "value": 23, "label": "Anger", "fill": "#FF4500", "index": 0.3 },
                        { "value": 70, "label": "Fear", "fill": "#9370DB", "index": 0.4 },
                        { "value": 34, "label": "Surprise", "fill": "#98FB98", "index": 0.5 },
                        { "value": 56, "label": "Disgust", "fill": "#8A2BE2", "index": 0.6 },
                        { "value": 78, "label": "Excitement", "fill": "#32CD32", "index": 0.7 },
                        { "value": 12, "label": "Boredom", "fill": "#FFA07A", "index": 0.8 }
                    ]
                },
                {
                    "day": "Tuesday",
                    "traits": [
                        { "value": 34, "label": "Happiness", "fill": "#FFD700", "index": 0.1 },
                        { "value": 56, "label": "Sadness", "fill": "#87CEEB", "index": 0.2 },
                        { "value": 78, "label": "Anger", "fill": "#FF4500", "index": 0.3 },
                        { "value": 12, "label": "Fear", "fill": "#9370DB", "index": 0.4 },
                        { "value": 45, "label": "Surprise", "fill": "#98FB98", "index": 0.5 },
                        { "value": 67, "label": "Disgust", "fill": "#8A2BE2", "index": 0.6 },
                        { "value": 23, "label": "Excitement", "fill": "#32CD32", "index": 0.7 },
                        { "value": 61, "label": "Boredom", "fill": "#FFA07A", "index": 0.8 }
                    ]
                },
                {
                    "day": "Wednesday",
                    "traits": [
                        { "value": 56, "label": "Happiness", "fill": "#FFD700", "index": 0.1 },
                        { "value": 78, "label": "Sadness", "fill": "#87CEEB", "index": 0.2 },
                        { "value": 12, "label": "Anger", "fill": "#FF4500", "index": 0.3 },
                        { "value": 45, "label": "Fear", "fill": "#9370DB", "index": 0.4 },
                        { "value": 67, "label": "Surprise", "fill": "#98FB98", "index": 0.5 },
                        { "value": 23, "label": "Disgust", "fill": "#8A2BE2", "index": 0.6 },
                        { "value": 56, "label": "Excitement", "fill": "#32CD32", "index": 0.7 },
                        { "value": 34, "label": "Boredom", "fill": "#FFA07A", "index": 0.8 }
                    ]
                }
            ]
        };

        try {
            // Simulate API call
            const response: ApiResponse = await new Promise((resolve) => setTimeout(() => resolve(apiResponse), 1200));

            if (response.success) {
                setData(response.data);
                setLoading(false);
            } else {
                setError('No data available for this week.');
                setLoading(false);
            }
        } catch (error) {
            setError('An error occurred while fetching data. Please try again later.');
            setLoading(false);
        }
    };

    //Daily journal analysis
    const getDailyJournalAnalysisReport = async () => {
        try {
            const res = await axios.post('/api/journal/analyzeweek');



            console.log("Journal response: ", res);

            if (res.status === 200) {
                setJournalAnalysis(res?.data?.results)
            }
        } catch (error) {
            console.log("Journal analysis error: ", error);
        }
    }

    useEffect(() => {
        getDailyJournalAnalysisReport();
    }, [])


    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full min-h-screen"
        >
            <Card className="w-full max-w-7xl mx-auto border border-black/20 dark:border-white/10 text-black dark:text-white shadow-lg p-4 rounded-xl">
                <div>
                    <h2 className={cn("text-2xl font-semibold mb-4 text-center", poppins.className)} >Reports</h2>
                    <div className={cn("grid grid-cols-4 gap-6 mx-auto w-full", poppins.className)}>
                        <div className="col-span-3">
                            <WeekControls currentDate={currentDate} setCurrentDate={setCurrentDate} isLoading={loading} />
                        </div>
                        <div className="col-span-1 pt-2">
                            <Button
                                size="sm"
                                onClick={() => toPDF()}
                            >
                                Download Report 📥
                            </Button>
                        </div>
                    </div>
                    <div ref={targetRef} className={cn("pt-4 pl-4", poppins.className)}>
                        <h4>{APP_NAME} Report</h4>
                        <h4> Patient Name:  {session?.user.name} </h4>
                        <h4>Report week: {formatWeek(currentDate)}</h4>
                        <ChartContainer data={data} />
                    </div>
                    {loading && <LoadingSpinner />}
                    {error && <ErrorMessage message={error} />}
                </div>
                <div>
                    <h2>
                        {journalAnalysis?.overall_mood}
                    </h2>
                    <h2>
                        {journalAnalysis?.overall_emotions.happy}
                    </h2>
                    <h2>
                        {journalAnalysis?.overall_emotions.sad}
                    </h2>
                    <h2>
                        {journalAnalysis?.overall_emotions.anxious}
                    </h2>
                    <h2>
                        {journalAnalysis?.overall_emotions.depressed}
                    </h2>
                </div>
            </Card>
        </motion.div>
    );
};

export default ReportPage;