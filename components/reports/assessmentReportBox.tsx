import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { WobbleCard } from '../ui/wobble-card';
import { poppins } from '@/helpers/fonts';
import { cn } from '@/lib/utils';
import { getSentimentStatement } from '@/helpers/giveSentiment';

interface Assessment {
    userID: string;
    responses: number[];
    moodScore: number;
    mood: string;
    date: Date;
}
interface AssessmentReportBoxProps {
    currentDate: Date
}

export const AssessmentReportBox = ({ currentDate }: AssessmentReportBoxProps) => {
    const [assessments, setAssessments] = useState<Assessment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAssessments = async () => {
            try {
                const response = await axios.post('/api/assessments/weekly', {
                    'current_date': currentDate
                });

                console.log("Retrive Assement response", response)
                setAssessments(response.data.results);
            } catch (err) {
                setError('Failed to fetch assessments');
            } finally {
                setLoading(false);
            }
        };

        fetchAssessments();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (

        <div>
            <h1 className='text-lg text-center mb-3 mt-8'>Weekly Assessement Analysis</h1>
            <div className="grid grid-cols-4 gap-6 max-w-7xl mx-auto w-full">
                {assessments.length > 0 ? (
                    assessments.map((assessment) => {
                        const sentiment = getSentimentStatement(assessment.moodScore / 100);
                        const statement = sentiment?.statements[Math.floor(Math.random() * sentiment.statements.length)];

                        return (<WobbleCard key={assessment.date.toString()} containerClassName="col-span-1 bg-yellow-600">
                            <p
                                className={cn(
                                    "text-md md:text-sm lg:text-lg font-extrabold",
                                    poppins.className
                                )}
                            >
                                {new Date(assessment.date).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </p>
                            <p className="text-md">Mood: {assessment.mood}</p>
                            <p className="text-md">Mood Score: {assessment.moodScore.toFixed(2)}</p>

                            <div className="rounded-xl overflow-x p-3">
                                <small className="break-all"><b>Suggestion</b> - <br />{statement}</small>
                                <br />
                            </div>

                        </WobbleCard>)
                    })
                ) : (
                    <p>No assessments available for the last 7 days.</p>
                )}
            </div>
        </div>
    );
};