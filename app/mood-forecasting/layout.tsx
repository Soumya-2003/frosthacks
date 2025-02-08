"use client"

import { Navbar } from "@/components/navbar";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";


const MoodForecastingLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SessionProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
            >
                <div
                    className="min-h-screen flex flex-col w-screen px-16 items-center dark:bg-black bg-white pb-8"
                >
                    {/* Add sidebar for small screens */}
                    <Navbar />
                    <div
                        className="mt-36"
                    >
                        {children}
                    </div>
                </div>
            </ThemeProvider>
        </SessionProvider>
    );
}

export default MoodForecastingLayout;