'use client'

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { journalSchema } from "@/schemas/journal.schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import axios from 'axios';
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/loadingSpinner";
import { PredictMoodDialog } from "@/components/predictMoodDialog";

const JournalPage = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [moodScore, setMoodScore] = useState<number>(0);
    const { toast } = useToast();

    // Function to normalize date (Fix timezone issue)
    const normalizeDate = (date: Date) => {
        return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
            .toISOString()
            .split('T')[0]; // Extract YYYY-MM-DD
    };

    const form = useForm<z.infer<typeof journalSchema>>({
        resolver: zodResolver(journalSchema),
        defaultValues: {
            date: normalizeDate(selectedDate),
            content: ""
        }
    });

    // Fetch journal when date changes
    useEffect(() => {
        const fetchJournalEntry = async () => {
            console.log("Fetching Journal Entry...");
            setIsFetching(true);
            try {
                const formattedDate = normalizeDate(selectedDate);
                console.log("Formatted Date before request: ", formattedDate);

                const res = await axios.get(`/api/journal/view?date=${formattedDate}`);
                setIsFetching(false);

                console.log("Journal Response: ", res);

                if (res.status === 200 && res.data && typeof res.data.content === "string") {
                    form.setValue("content", res.data.content);
                } else {
                    form.setValue("content", "");
                }
            } catch (error) {
                console.error("Error fetching journal entry:", error);
                setIsFetching(false);
                toast({
                    title: "Error",
                    description: "Failed to fetch journal entry",
                    variant: "destructive",
                });
            }
        };

        fetchJournalEntry();
        form.setValue("date", normalizeDate(selectedDate));
    }, [selectedDate, form, toast]);

    const onSubmit = async (formData: z.infer<typeof journalSchema>) => {
        if (isSaving) return;
        
        setIsSaving(true);
        
        try {
            const data = {
                date: normalizeDate(selectedDate),
                content: formData.content.trim(),
            };

            const content = form.getValues("content").trim();
            if (!content) {
                toast({
                    title: "Warning",
                    description: "Journal content cannot be empty.",
                    variant: "destructive",
                });
                return;
            }

            const res = await axios.post('/api/journal', data);

            if (res.status === 200) {
                toast({
                    title: "Success!",
                    description: "Your journal was saved successfully!",
                });
            } else {
                throw new Error("Failed to save journal");
            }
        } catch (error) {
            console.error("Journal save error:", error);
            toast({
                title: "Error",
                description: "Failed to save journal!",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handlePredictMood = async () => {
        setIsOpen(true);
        try {
            const content = form.getValues("content").trim();
            const res = await axios.post('/api/journal/analyze-content', { content }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            console.log('Mood Analysis Response: ',res.data);
            
            
            if (res.status === 200) {
                setMoodScore(res?.data?.sentiment_score ?? 0);
            }
        } catch (error) {
            console.error("Journal analysis error: ", error);
            toast({
                title: "Error",
                description: "Failed to analyze journal content",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-7xl p-4 lg:p-6">
            {/* Calendar Section */}
            <motion.div className="lg:col-span-4 col-span-12"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}>
                <Card className="w-full shadow-xl dark:shadow-2xl rounded-lg flex flex-col p-4">
                    <CardContent className="flex flex-col items-center justify-center h-full text-center">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white pb-4">Today's Date</h2>
                        <Calendar 
                            mode="single" 
                            selected={selectedDate} 
                            onSelect={(date) => date && setSelectedDate(date)}
                            disabled={{ after: new Date() }} 
                            className="rounded-md border shadow-md w-full" 
                        />
                    </CardContent>
                </Card>
            </motion.div>

            {/* Journal Writing Section */}
            <motion.div className="lg:col-span-8 col-span-12"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}>
                <Card className="w-full lg:h-[413px] h-[300px] shadow-xl dark:shadow-2xl rounded-lg flex flex-col">
                    <CardContent className="flex flex-col p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-center">Write your Journal</h2>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-grow space-y-4">
                                <FormField 
                                    control={form.control} 
                                    name="content" 
                                    render={({ field }) => (
                                        <FormItem className="flex-grow relative">
                                            {isFetching && (
                                                <div className="absolute top-1/2 left-1/2 transform -translate-x-2/5 -translate-y-1/2">
                                                    <LoadingSpinner />
                                                </div>
                                            )}
                                            <Textarea 
                                                {...field} 
                                                placeholder="Express your day..." 
                                                disabled={isFetching}
                                                className="w-full h-60 p-4 text-lg rounded-md border dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300" 
                                            />
                                        </FormItem>
                                    )} 
                                />
                                <div className="flex justify-end">
                                    {form.getValues("content").trim() !== "" && !isFetching && (
                                        <Button 
                                            type="button"
                                            size="lg" 
                                            className="bg-yellow-500 hover:bg-yellow-400 mr-8" 
                                            onClick={handlePredictMood}
                                        >
                                            Check my mood💡
                                        </Button>
                                    )}
                                    <Button
                                        type="submit"
                                        className="self-end"
                                        size="lg"
                                        disabled={isSaving || isFetching}
                                    >
                                        {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                {isOpen && (
                    <PredictMoodDialog
                        isOpen={isOpen}
                        moodScore={moodScore}
                        onClose={() => setIsOpen(false)}
                    />
                )}
            </motion.div>
        </div>
    );
};

export default JournalPage;
