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
import { formatToLocalDate } from "@/lib/utils";

const JournalPage = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof journalSchema>>({
        resolver: zodResolver(journalSchema),
        defaultValues: {
            date: selectedDate.toISOString().split('T')[0], // Ensure date is stored in YYYY-MM-DD
            content: ""
        }
    });

    // Fetch journal when date changes
    useEffect(() => {
        const fetchJournalEntry = async () => {
            setIsFetching(true);
            try {
                const formattedDate = selectedDate.toISOString().split('T')[0];
                const res = await axios.get(`/api/journal/view?date=${formattedDate}`);

                console.log("Journal Entry:", res.data); // ✅ Debugging
                setIsFetching(false);

                if (res.status === 200 && res.data.content) {
                    form.setValue("content", res.data.content);
                } else {
                    form.setValue("content", "");
                }
            } catch (error) {
                console.error("Error fetching journal entry:", error);
                setIsFetching(false);
            }
        };

        fetchJournalEntry();
        form.setValue("date", selectedDate.toISOString().split('T')[0]); // ✅ Ensure consistent format

    }, [selectedDate]);

    // // Auto-save journal every 5 seconds
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         const content = form.getValues("content").trim();
    //         if (content !== "") {
    //             handleSave(true); // Auto-save mode
    //         }
    //     }, 5000);

    //     return () => clearInterval(interval);
    // }, [selectedDate, form]);

    // Save journal manually or automatically
    const handleSave = async (isAutoSave = false) => {
        setIsSaving(true);

        try {
            const data = {
                date: selectedDate.toISOString().split('T')[0],
                content: form.getValues("content"),
            };

            console.log("Form data: ",data.date);

            const res = await axios.post('/api/journal', data);

            if (res.status === 200) {
                toast({
                    title: "Success!",
                    description: "Your journal was saved successfully!"
                });
            }
        } catch (error) {
            console.error("Journal save error:", error);
                toast({
                    title: "Error",
                    description: "Failed to save journal!",
                    variant: "destructive"
                });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-7xl p-4 lg:p-6">

            {/* 📅 Calendar Section */}
            <motion.div className="lg:col-span-4 col-span-12"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}>
                <Card className="w-full shadow-xl dark:shadow-2xl rounded-lg flex flex-col p-4">
                    <CardContent className="flex flex-col items-center justify-center h-full text-center">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white pb-4">Today's Date</h2>
                        <Calendar mode="single" selected={selectedDate} onDayClick={(d) => setSelectedDate(d)}
                            disabled={{ after: new Date() }} className="rounded-md border shadow-md w-full" />
                    </CardContent>
                </Card>
            </motion.div>

            {/* 📝 Journal Writing Section */}
            <motion.div className="lg:col-span-8 col-span-12"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}>
                <Card className="w-full lg:h-[413px] h-[300px] shadow-xl dark:shadow-2xl rounded-lg flex flex-col">
                    <CardContent className="flex flex-col p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-center">Write your Journal</h2>
                        <h4 className="text-center pb-2">{formatToLocalDate(selectedDate)}</h4>
                        <Form {...form}>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                handleSave();
                            }} className="flex flex-col flex-grow space-y-4">
                                <FormField control={form.control} name="content" render={({ field }) => (
                                    <FormItem className="flex-grow relative">
                                        {isFetching ?
                                            <div className="absolute top-1/2 left-1/2 transform -translate-x-2/5 -translate-y-1/2">
                                                <LoadingSpinner />
                                            </div>
                                            : null}
                                        <Textarea {...field} placeholder="Express your day..." disabled={isFetching}
                                            className="w-full h-60 p-4 text-lg rounded-md border dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300" />
                                    </FormItem>
                                )} />
                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        className="self-end"
                                        size={'lg'}
                                        disabled={selectedDate.getDate() !== new Date().getDate()}>
                                        {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default JournalPage;
