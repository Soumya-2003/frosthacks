'use-client';

import React, { useEffect, useRef } from 'react';
import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group";
import { motion } from "motion/react";
import { ResponsiveContainer } from "recharts";
import { Card, CardContent } from "./ui/card";
import { useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { poppins } from "@/helpers/fonts";
import { cn } from "@/lib/utils";
import { SocialMedia } from '@/helpers/constants';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/loadingSpinner';

interface Sentiment {
    name: string;
    value: number;
}

interface ChildNode {
    name: string;
    value: number;
    children: Sentiment[];
}

interface MockData {
    name: string;
    children: ChildNode[];
}

const SocialMediaAnalysisTool: React.FC = () => {
    const [socialMedia, setSocialMedia] = useState<SocialMedia>(SocialMedia.Twitter);
    const [username, setUsername] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [chartData, setChartData] = useState<MockData | null>(null);
    const chartRef = useRef<HTMLDivElement | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (chartData && chartRef.current) {
            let root = am5.Root.new(chartRef.current);

            root.setThemes([
                am5themes_Animated.new(root)
            ]);

            let container = root.container.children.push(am5.Container.new(root, {
                width: am5.percent(100),
                height: am5.percent(100),
                layout: root.verticalLayout
            }));

            let series = container.children.push(am5hierarchy.ForceDirected.new(root, {
                singleBranchOnly: false,
                downDepth: 1,
                initialDepth: 2,
                valueField: "value",
                categoryField: "name",
                childDataField: "children",
                centerStrength: 0.5,
                minRadius: 15,
                maxRadius: 90
            }));

            series.data.setAll([chartData]);
            series.set("selectedDataItem", series.dataItems[0]);

            series.appear(1000, 100);

            return () => {
                root.dispose();
            };
        }
    }, [chartData]);

    const handleSelection = (value: string, setSocialMedia: React.Dispatch<React.SetStateAction<SocialMedia>>) => {
        if (value in SocialMedia) {
            setSocialMedia(value as SocialMedia);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!username.trim()) {
            // TODO: remove alert after fixing toast hook
            alert("Please enter username");
            toast({
                title: "Please enter username"
            });
            return;
        }

        setLoading(true);
        setChartData(null);

        try {
            const data = await mockApi("@" + username.trim());
            setChartData(data);
        } catch (error) {
            console.error("API Error:", error);
            // TODO: remove alert after fixing toast hook
            alert("Failed to fetch data. Please try again later.");
            toast({
                title: "Failed to fetch data. Please try again later."
            });
        } finally {
            setLoading(false);
        }
    };

    const mockApi = (username: string): Promise<MockData> => {
        // TODO: replace with flask api
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(getMockTwitterData(username));
            }, 2000);
        });
    };

    const getMockTwitterData = (username: string): MockData => {
        return {
            name: username,
            children: [
                {
                    name: "Positive",
                    value: 70,
                    children: [
                        { name: "Sentiment 1", value: 15 },
                        { name: "Sentiment 2", value: 20 },
                        { name: "Sentiment 3", value: 10 },
                        { name: "Sentiment 4", value: 15 },
                        { name: "Sentiment 5", value: 10 },
                    ],
                },
                {
                    name: "Negative",
                    value: 30,
                    children: [
                        { name: "Sentiment 1", value: 10 },
                        { name: "Sentiment 2", value: 5 },
                        { name: "Sentiment 3", value: 5 },
                        { name: "Sentiment 4", value: 5 },
                        { name: "Sentiment 5", value: 5 },
                    ],
                },
            ],
        };
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full flex flex-col items-center w-screen min-h-screen"
        >
            <Card className="w-full max-w-5xl mx-auto border border-black/20 dark:border-white/10 shadow-lg p-4 rounded-xl">
                <CardContent className="p-2 sm:p-4 flex flex-col gap-6">
                    <h2 className={cn("text-2xl text-center font-semibold text-gray-900 dark:text-white pb-4", poppins.className)}>Social Media Analysis</h2>
                    <ToggleGroup
                        type="single"
                        value={socialMedia}
                        onValueChange={(value) => value && handleSelection(value, setSocialMedia)}
                        className={cn("flex space-x-2 justify-center", poppins.className)}
                    >
                        <div className="relative group">
                            <ToggleGroupItem
                                value={SocialMedia.Twitter}
                                className={`px-3 py-1 rounded-md ${socialMedia === SocialMedia.Twitter ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                                    }`}
                            >
                                {SocialMedia.Twitter}
                            </ToggleGroupItem>
                        </div>
                        <div className="relative group">
                            <ToggleGroupItem
                                value={SocialMedia.Instagram}
                                disabled
                                className="px-3 py-1 rounded-md bg-gray-200 text-black cursor-not-allowed"
                            >
                                {SocialMedia.Instagram}
                            </ToggleGroupItem>
                            <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-max bg-black text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                Coming Soon
                            </div>
                        </div>
                        <div className="relative group">
                            <ToggleGroupItem
                                value={SocialMedia.Facebook}
                                disabled
                                className="px-3 py-1 rounded-md bg-gray-200 text-black cursor-not-allowed"
                            >
                                {SocialMedia.Facebook}
                            </ToggleGroupItem>
                            <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-max bg-black text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                Coming Soon
                            </div>
                        </div>
                    </ToggleGroup>

                    <div className={cn("w-full", poppins.className)}>
                        <ResponsiveContainer width={"100%"} height={"100%"} className={"p-8"}>
                            <div className="flex justify-center">
                                <form className="flex rounded-lg shadow-sm" onSubmit={handleSubmit}>
                                    <span className="px-3 py-2 pe-4 inline-flex items-center min-w-fit rounded-s-md border border-e-0 border-gray-200 bg-gray-50 text-sm text-gray-500 dark:bg-neutral-700 dark:border-neutral-700 dark:text-neutral-400">@</span>
                                    <input
                                        type="text"
                                        placeholder="Enter username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="py-2 px-3 pe-11 block w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        type="submit"
                                        className="p-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled={loading}
                                    >
                                        {loading ? "Loading..." : "Submit"}
                                    </button>
                                </form>
                            </div>
                        </ResponsiveContainer>
                    </div>

                    {loading && <LoadingSpinner />}

                    {chartData && (
                        <div id="chartdiv" ref={chartRef} className="w-full h-64 sm:h-80">
                            {/* The chart will be rendered here by AMCharts */}
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default SocialMediaAnalysisTool;