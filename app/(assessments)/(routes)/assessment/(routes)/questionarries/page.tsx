'use client'

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import mentalHealthQuestions from "../../constant";
import { ProgressBar } from "@/components/progressbar";
import { QuestionCard } from "@/components/questionCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from 'framer-motion';
import { THANKS_MESSAGE } from "@/helpers/constants";
import { poppins, rubik } from "@/helpers/fonts";
import { Card } from "@/components/ui/card";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

const getRandomQuestions = (questions: string[], count: number) => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

const Questionaire = () => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
    const [responses, setResponses] = useState<number[]>([]);
    const [isQuizComplete, setIsQuizComplete] = useState<boolean>(false);
    const [responseHistory, setResponseHistory] = useState<{ [key: string]: number[][] }>({});
    const { toast } = useToast();

    useEffect(() => {
        const randomQuestions = getRandomQuestions(mentalHealthQuestions, 7);
        setSelectedQuestions(randomQuestions);
        setResponses(Array(randomQuestions.length).fill(0));
    }, []);

    const handleNext = () => {
        if (currentIndex < selectedQuestions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    }

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    }

    const handleResponse = (value: number) => {
        const updatedResponse = [...responses];
        updatedResponse[currentIndex] = value;
        setResponses(updatedResponse);
    }

    const handleSubmit = async() => {
        const today = new Date().toISOString().split('T')[0];
        setResponseHistory((prevHistory) => ({
            ...prevHistory,
            [today]: [...(prevHistory[today] || []), responses]
        }));

        try {
            const res = await axios.post("/api/assessment",responses);

            if(res.status === 200){
                toast({
                    title: "Hurray!!",
                    description: "Quiz submitted successfully!!"
                })
            }
        } catch (error) {
            console.log("MCQ Error: ",error);
            toast({
                title: "Oops!!",
                description: "Something went wrong.",
                variant: "destructive"
            })
        }

        setIsQuizComplete(true);
    }

    console.log("Quiz: ",responses);

    const handleRetry = () => {
        setCurrentIndex(0);
        setIsQuizComplete(false);
        setResponses(Array(selectedQuestions.length).fill(0));
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn("flex flex-col items-center", poppins.className)}
        >
            <Card
                className="w-full max-w-3xl  backdrop-blur-lg shadow-2xl rounded-2xl p-6 md:p-8 border border-gray-300 dark:border-white/70"
            >
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
                    Mental Health Self-Assessment
                </h1>

                <p className="text-center mb-6 text-sm mb:text-base">
                    Answer the following questions to assess your mental well-being.
                </p>

                <ProgressBar
                    current={currentIndex + 1}
                    total={selectedQuestions.length}
                />

             
                    <QuestionCard
                        question={selectedQuestions[currentIndex]}
                        onResponse={handleResponse}
                        selectedValue={responses[currentIndex]}
                    />
        

                <div className="flex justify-between mt-6 space-x-4">
                    <Button
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        className="w-1/2 md:w-auto"
                    >
                        <ArrowLeft />
                    </Button>
                    {currentIndex < selectedQuestions.length - 1 ? (
                        <Button
                            onClick={handleNext}
                            disabled={responses[currentIndex] === 0}
                            className="w-1/2 md:w-auto"
                        >
                            <ArrowRight />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            variant={'outline'}
                            className="w-1/2 md:w-auto"
                        >
                            Submit
                        </Button>
                    )}
                </div>

                {isQuizComplete && (
                    <div className="mt-6 text-center">
                        <p className="text-lg font-semibold text-green-600">
                            {THANKS_MESSAGE}
                        </p>
                        <Button
                            variant='destructive'
                            onClick={handleRetry}
                            className="mt-4"
                        >
                            Retry Quiz
                        </Button>
                    </div>
                )}
            </Card>
        </motion.div>
    );
}

export default Questionaire;