'use client'

import { useEffect, useState } from "react";
import { prompts } from "../../constant";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ProgressBar } from "@/components/progressbar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { THANKS_MESSAGE } from "@/helpers/constants";
import { poppins } from "@/helpers/fonts";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface ResponseEntry {
    prompt: string;
    response: string;
}

const SentenceFormation = () => {
    const [currentPrompt, setCurrentPrompt] = useState(0);
    const [userResponses, setUserResponses] = useState<ResponseEntry[]>([]);
    const [timer, setTimer] = useState(60);
    const [isTimeUp, setIsTimeUp] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [responseHistory, setResponseHistory] = useState<{ [key: string]: ResponseEntry[] }>({});

    useEffect(() => {
        if (timer > 0) {
            const countdown = setTimeout(() => setTimer(timer - 1), 1000);
            return () => clearTimeout(countdown);
        } else {
            setIsTimeUp(true);
        }
    }, [timer]);

    const handleNextPrompt = () => {
        if (currentPrompt < prompts.length - 1) {
            setCurrentPrompt(currentPrompt + 1);
            setTimer(60);
            setIsTimeUp(false);
        } else {
            handleFinalSubmit();
        }
    };

    const handleInputChange = (value: string) => {
        const responses = [...userResponses];
        responses[currentPrompt] = {
            prompt: prompts[currentPrompt].join(", "),
            response: value
        };
        setUserResponses(responses);
    };

    const handleFinalSubmit = () => {
        const today = new Date().toISOString().split('T')[0];
        setResponseHistory((prevHistory) => ({
            ...prevHistory,
            [today]: [...(prevHistory[today] || []), ...userResponses]
        }));
        setIsSubmitted(true);
    };

    const handleRetry = () => {
        setCurrentPrompt(0);
        setUserResponses([]);
        setTimer(60);
        setIsTimeUp(false);
        setIsSubmitted(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn("flex flex-col items-center", poppins.className)}
        >
            {!isSubmitted ? (
                <Card className="w-full max-w-lg md:max-w-2xl lg:max-w-4xl p-6 shadow-lg">
                    <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
                        Sentence Formation Test
                    </h1>
                    <CardHeader className="text-center text-lg font-semibold text-gray-700">
                        Step {currentPrompt + 1} of {prompts.length}
                    </CardHeader>

                    <ProgressBar current={currentPrompt + 1} total={prompts.length} />

                    <CardContent className="flex flex-col gap-4 mt-4">
                        <div className="text-center text-lg font-medium">
                            Use these words to form a sentence:
                            <span className="block mt-2 text-blue-600 font-semibold">
                                {prompts[currentPrompt].join(", ")}
                            </span>
                        </div>

                        <div className="text-center text-gray-600">
                            Time Remaining:{" "}
                            <span className={timer <= 10 ? "text-red-600 font-bold" : "font-bold"}>
                                {timer} sec
                            </span>
                        </div>
                        <Textarea
                            value={userResponses[currentPrompt]?.response || ""}
                            onChange={(e) => handleInputChange(e.target.value)}
                            className="w-full text-lg p-3"
                            disabled={isTimeUp}
                        />

                        <Button
                            onClick={handleNextPrompt}
                            disabled={!userResponses[currentPrompt]?.response && !isTimeUp}
                            className="w-full py-3 text-lg"
                        >
                            {currentPrompt < prompts.length - 1 ? "Next" : "Submit"}
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="text-center text-xl font-semibold text-green-600">
                    <p>{THANKS_MESSAGE}</p>
                    <Button
                        onClick={handleRetry}
                        variant='destructive'
                        className="mt-4"
                    >
                        Retry Test
                    </Button>
                </div>
            )}
        </motion.div>
    );
}

export default SentenceFormation;