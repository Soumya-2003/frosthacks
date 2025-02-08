'use client'


import { MoodHistoryChart } from "@/components/moodHistory";
import { journal, mood, notepad3, report, social } from "@/assets/assets";
import { WobbleCard } from "@/components/ui/wobble-card";
import { APP_NAME, getRandomElement, motivationalQuotes, Routes } from "@/helpers/constants";
import { cn } from "@/lib/utils";
import { poppins, rubik } from "@/helpers/fonts";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useEffect } from "react";



const DashboardPage = () => {

    const { data: session } = useSession();

    const user = session?.user

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return "Good Morning";
        if (hour >= 12 && hour < 18) return "Good Afternoon";
        if (hour >= 18 && hour < 21) return "Good Evening";
        return "Good Night";
    };

    useEffect(() => {
        const recordLogin = async () => {
            try {
                const response = await axios.post("/api/daily-login",{});
                console.log(response.data.message);
            } catch (error: any) {
                console.error("Login tracking failed:", error);
            }
        };

        recordLogin();
    }, []);

    return (
        <div
            className="space-y-8 flex flex-col items-center w-full max-w-7xl top-15"
        >
            <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto w-full"
            >
                <WobbleCard
                    containerClassName="col-span-1 lg:col-span-2 h-full bg-green-600 min-h-[300px] flex flex-col justify-center"
                >
                    <h2
                        className={cn("text-xl md:text3xl lg:text-4xl text-black font-extrabold", rubik.className)}
                    >
                        {getGreeting()} {user?.username}
                    </h2>
                    <p
                        className="mt-3 text-base md:text-lg text-slate-800 font-semibold"
                    >
                        {getRandomElement(motivationalQuotes, motivationalQuotes.length)} {/* TODO: fix hydration error */}
                    </p>
                </WobbleCard>
                <Link href={Routes.Assessment} >
                    <WobbleCard
                        containerClassName="col-span-1 h-full min-h-[300px]"
                    >
                        <h2
                            className={cn("text-lg md:text-2xl lg:text-4xl font-extrabold", poppins.className)}
                        >
                            Assessments
                        </h2>
                        <Image
                            src={notepad3}
                            alt="notepad3"
                            height={300}
                            className="object-cover absolute -bottom-32 -right-12 p-0 m-0"
                        />
                    </WobbleCard>
                </Link>
                <Link href={Routes.Journal} >
                    <WobbleCard
                        containerClassName="col-span-1 h-full min-h-[300px] bg-pink-600"
                    >
                        <h2
                            className={cn("text-lg md:text-2xl lg:text-4xl font-extrabold", poppins.className)}
                        >
                            Journal
                        </h2>
                        <Image
                            src={journal}
                            alt="journal"
                            height={350}
                            className="object-cover absolute -bottom-32 -right-16 p-0 m-0"
                        />
                    </WobbleCard>
                </Link>
                <Link href={Routes.MoodForcasting} >
                    <WobbleCard
                        containerClassName="col-span-1 h-full min-h-[300px] bg-amber-600"
                    >
                        <h2
                            className={cn("text-lg md:text-2xl lg:text-4xl font-extrabold", poppins.className)}
                        >
                            Mood Forcasting
                        </h2>
                        <Image
                            src={mood}
                            alt="mood"
                            height={350}
                            className="object-cover absolute -bottom-32 -right-16 p-0 m-0"
                        />
                    </WobbleCard>
                </Link>
                <Link href={Routes.Report} >
                    <WobbleCard
                        containerClassName="col-span-1 h-full min-h-[300px] bg-violet-600"
                    >
                        <h2
                            className={cn("text-lg md:text-2xl lg:text-4xl font-extrabold", poppins.className)}
                        >
                            Reports
                        </h2>
                        <Image
                            src={report}
                            alt="report"
                            height={600}
                            width={600}
                            className="object-cover absolute -bottom-24 -right-16 p-0 m-0"
                        />
                    </WobbleCard>
                </Link>
                <Link href={Routes.SocialMediaAnalysis} >
                    <WobbleCard
                        containerClassName="col-span-1 h-full min-h-[300px] bg-yellow-500"
                    >
                        <h2
                            className={cn("text-lg md:text-2xl lg:text-4xl font-extrabold", poppins.className)}
                        >
                            Social Media Analysis
                        </h2>
                        <Image
                            src={social}
                            alt="social"
                            height={600}
                            width={600}
                            className="object-cover absolute -bottom-24 -right-16 p-0 m-0"
                        />
                    </WobbleCard>
                </Link>

                <Link href={Routes.Entertainment} >
                    <WobbleCard
                        containerClassName="col-span-1 h-full min-h-[300px] bg-violet-600"
                    >
                        <h2
                            className={cn("text-lg md:text-2xl lg:text-4xl font-extrabold", poppins.className)}
                        >
                            Entertainment
                        </h2>
                        <Image
                            src={report}
                            alt="report"
                            height={600}
                            width={600}
                            className="object-cover absolute -bottom-24 -right-16 p-0 m-0"
                        />
                    </WobbleCard>
                </Link>
            </div>
            <div
                className="w-full flex justify-center items-center"
            >
                <MoodHistoryChart />
            </div>
        </div>
    );
}

export default DashboardPage;