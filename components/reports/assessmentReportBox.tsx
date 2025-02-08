import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { WobbleCard } from '../ui/wobble-card';
import { poppins } from '@/helpers/fonts';
import { cn } from '@/lib/utils';

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
    if (error) return <p>{error}</p>;

    return (

        <div>
            <h1 className='text-lg text-center mb-3 mt-8'>Weekly Assessement Analysis</h1>
            <div className="grid grid-cols-4 gap-6 max-w-7xl mx-auto w-full">
            {assessments.length > 0 ? (
                assessments.map((assessment) => (
                    <WobbleCard key={assessment.date.toString()} containerClassName="col-span-1 bg-yellow-600">
                        <p
                            className={cn(
                                "text-md md:text-sm lg:text-lg font-extrabold",
                                poppins.className
                            )}
                        >
                            Date: {new Date(assessment.date).toLocaleDateString()}
                        </p>
                        <p className="text-lg font-bold">Date: {new Date(assessment.date).toLocaleDateString()}</p>
                        <p className="text-md">Mood: {assessment.mood}</p>
                        <p className="text-md">Mood Score: {assessment.moodScore.toFixed(2)}</p>
                    </WobbleCard>
                ))
            ) : (
                <p>No assessments available for the last 7 days.</p>
            )}
        </div>
        </div>
    );
};