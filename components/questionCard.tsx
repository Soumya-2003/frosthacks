import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from 'motion/react'
import { poppins, rubik } from "@/helpers/fonts";
import { cn } from "@/lib/utils";


const likertScale = [
    {
        value: 1,
        label: "Never"
    },
    {
        value: 2,
        label: "Rarely"
    },
    {
        value: 3,
        label: "Sometimes"
    },
    {
        value: 4,
        label: "Often"
    },
    {
        value: 5,
        label: "Always"
    }
]

interface questionCardProps {
    question: string,
    onResponse: (value: number) => void
    selectedValue: number
}

export const QuestionCard = ({
    question,
    onResponse,
    selectedValue
}: questionCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card
                className="p-6 text-center backdrop-blur-lg 
                shadow-lg rounded-lg border border-gray-300 dark:border-gray-700"
            >
                <h2
                    className={cn("text-lg md:text-xl font-semibold text-gray-900 dark:text-white", rubik.className)}
                >
                    {question}
                </h2>
                <CardContent
                    className="flex flex-wrap justify-center gap-2 md:gap-4 mt-4"
                >
                    {
                        likertScale.map((option) => (
                            <motion.div
                                key={option.value}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    variant={selectedValue === option.value ? "default" : "outline"}
                                    onClick={() => onResponse(option.value)}
                                    className={cn(`w-full sm:w-auto px-4 py-2 text-sm md:text-base 
                                            transition-all duration-300 ease-in-out
                                            ${selectedValue === option.value
                                            ? "bg-indigo-500 dark:bg-indigo-600 text-white"
                                            : "border-gray-500 text-gray-900 dark:text-gray-200"}`, poppins.className)}
                                >
                                    {option.label}
                                </Button>
                            </motion.div>
                        ))
                    }
                </CardContent>
            </Card>
        </motion.div>
    );
}