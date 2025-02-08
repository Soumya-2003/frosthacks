'use client'

import { MoodForecastingChart } from "@/components/moodForecasting";


const MoodForecastingPage = () => {
    return (
        <div className="w-full max-w-7xl flex justify-center items-center w-screen">
            <MoodForecastingChart />
        </div>
    );
}

export default MoodForecastingPage;