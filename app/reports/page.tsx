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
import { JournalReportBox } from '@/components/reports/journalReportBox';
import { AssessmentReportBox } from '@/components/reports/assessmentReportBox';

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

export interface EmotionResults {
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
    const { toPDF, targetRef } = usePDF({ filename: `Moodify Report ${formatWeek(currentDate)}.pdf` });
    const [journalAnalysis, setJournalAnalysis] = useState<EmotionResults | null>(null)
    const [weeklyReport, setWeeklyReport] = useState<DayData[]>([]);
    const { data: session } = useSession();

    //Daily journal analysis
    const getDailyJournalAnalysisReport = async () => {
        try {
            const res = await axios.post('/api/journal/analyzeweek', {
                'current_date': currentDate
            });

            console.log("Journal response: ", res);

            if (res.status === 200) {
                setJournalAnalysis(res?.data?.results)
            }
        } catch (error) {
            console.log("Journal analysis error: ", error);
            setLoading(false);
        }
    }

    // Weekly Report
    const buildWeeklyReport = async () => {
        console.log("coming inside")
        try {
            const res = await axios.post('/api/report', {
                'weekly_assessment': journalAnalysis,
                'current_date': currentDate
            });
            console.log("Report response: ", res);
            setLoading(false);
            if (res.status === 200) {
                setWeeklyReport(res?.data?.results.data)
            }
        } catch (error) {
            console.log("Report analysis error: ", error);
            setLoading(false);
        }

    }


    useEffect(() => {
        setLoading(true);
        getDailyJournalAnalysisReport();
    }, [currentDate]);

    useEffect(() => {
        if (journalAnalysis !== null) {
            buildWeeklyReport();
        }
    }, [journalAnalysis]);

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
                    <div ref={targetRef}>
                        <span className={cn("pt-4 pl-4", poppins.className)}>
                            <h4>{APP_NAME} Report</h4>
                            <h4> Patient Name:  {session?.user.name} </h4>
                            <h4>Report week: {formatWeek(currentDate)}</h4>
                            <h1 className='text-lg text-center mb-3 mt-8'>Overall Weekly Report</h1>
                            <ChartContainer data={weeklyReport} />
                        </span>
                        {!loading && journalAnalysis ? <JournalReportBox {...journalAnalysis} /> : null}
                        {!loading ? <AssessmentReportBox currentDate={currentDate} /> : null}
                    </div>
                    {loading && <LoadingSpinner />}
                    {error && <ErrorMessage message={error} />}
                </div>

            </Card>
        </motion.div>
    );
};

export default ReportPage;