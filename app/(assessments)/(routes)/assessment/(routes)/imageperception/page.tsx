'use client'

import { ProgressBar } from "@/components/progressbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { formSchema } from "@/schemas/imagePerceptionResponse.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { imageBasedQuestions } from '../../constant';
import * as z from 'zod';
import { THANKS_MESSAGE } from "@/helpers/constants";
import { poppins } from "@/helpers/fonts";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import ComingSoonPage from "@/components/comingSoon";

const ImagePerception = () => {
    const [currentImage, setCurrentImage] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isQuizComplete, setIsQuizComplete] = useState<boolean>(false);
    const [responses, setResponses] = useState<{ [key: string]: string[] }>({});
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            response: ""
        }
    });

    useEffect(() => {
        if (!isLoading && !isQuizComplete) {
            textareaRef.current?.focus();
        }
    }, [isLoading, isQuizComplete]);

    const handleNextImage = () => {
        setIsLoading(true);
        setTimeout(() => {
            if (currentImage < imageBasedQuestions.length - 1) {
                setCurrentImage((prev) => prev + 1);
            } else {
                setIsQuizComplete(true);
            }
            setIsLoading(false);
            form.reset();
        }, 200);
    };

    const handleResetQuiz = () => {
        setResponses({});
        setCurrentImage(0);
        setIsQuizComplete(false);
        form.reset();
    };

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        console.log("Response: ", responses);

        const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
        setResponses((prevResponses) => ({
            ...prevResponses,
            [today]: [...(prevResponses[today] || []), data.response]
        }));

        handleNextImage();
    };

    return(<ComingSoonPage />);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn("flex flex-col items-center", poppins.className)}
        >
            <Card className="w-full max-w-lg md:max-w-2xl lg:max-w-4xl p-4 md:p-6 shadow-lg ">
                <CardHeader className="text-center text-base md:text-lg font-semibold text-gray-700">
                    <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
                        Analysis Through Image Perception
                    </h1>
                    {isQuizComplete ? "You are done for today!" : `Step ${currentImage + 1} of ${imageBasedQuestions.length}`}
                </CardHeader>

                <div className="w-full mb-4">
                    <ProgressBar current={currentImage + 1} total={imageBasedQuestions.length} />
                </div>

                <CardContent className="flex flex-col items-center gap-4">
                    {isLoading ? (
                        <Skeleton className="w-full h-48 md:h-64 rounded-lg object-cover" />
                    ) : (
                        !isQuizComplete && (
                            <Image
                                src={imageBasedQuestions[currentImage]}
                                alt=""
                                className="object-cover rounded-lg shadow transition-all duration-300"
                            />
                        )
                    )}

                    {!isQuizComplete && (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
                                <FormField
                                    control={form.control}
                                    name="response"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm md:text-base">
                                                What emotions does this image evoke in you?
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    ref={(e) => {
                                                        field.ref(e);
                                                        textareaRef.current = e;
                                                    }}
                                                    placeholder="Describe your feelings..."
                                                    className="w-full text-sm md:text-base"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full text-sm md:text-base py-2 md:py-3">
                                    Submit Response
                                </Button>
                            </form>
                        </Form>
                    )}
                </CardContent>

                <CardFooter className="flex justify-center">
                    {!isQuizComplete ? (
                        <Button
                            variant={'secondary'}
                            onClick={handleNextImage}
                            disabled={currentImage === imageBasedQuestions.length - 1}
                            className="text-sm md:text-base"
                        >
                            Next Image
                        </Button>
                    ) : (

                        <div className="mt-6 text-center">
                            <p className="text-lg font-semibold text-green-600">
                                {THANKS_MESSAGE}
                            </p>
                            <Button
                                variant='destructive'
                                onClick={handleResetQuiz}
                                className="text-sm md:text-base mt-4"
                            >
                                Retry Quiz
                            </Button>
                        </div>
                    )}
                </CardFooter>
            </Card>
        </motion.div>
    );
}

export default ImagePerception;