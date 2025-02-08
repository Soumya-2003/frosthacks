'use client';

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageCircle, Send } from "lucide-react";
import { motion } from "framer-motion";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose
} from "@/components/ui/dialog"; // Adjust the import path as necessary
import axios from "axios";
import { poppins } from "@/helpers/fonts";
import { cn } from "@/lib/utils";

const ChatbotPage = () => {
    const [messages, setMessages] = useState<{ text: string; sender: "user" | "bot" }[]>([]);
    const [input, setInput] = useState("");

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { text: input, sender: "user" as "user" };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");

        const botResponse = await getBotResponse(input);
        setMessages((prev) => [...prev, { text: botResponse, sender: "bot" as "bot" }]);
    };

    const getBotResponse = async (message: string): Promise<string> => {

        try {
            const res = await axios.post('/api/chatbot', {
                message: message
            });

            if (res.status === 200) {
                console.log(res?.data.parts);
                if (res?.data.response && Array.isArray(res?.data.response.parts)) {
                    return res?.data.response.parts.map((part: { text: string }) => part.text).join(" ") || "I'm here to help!";
                }
                return "I'm here to help!";
            }
        } catch (error) {
            console.error("Error fetching bot response:", error);
            return "Sorry, I couldn't process your request.";
        }

        return "I'm here to help!";
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"> <MessageCircle size={20} />
                    <span>Chat</span>
                </Button>

            </DialogTrigger>
            <DialogContent>
                <DialogHeader className={cn("text", poppins.className)}>
                    <DialogTitle>Chatbot</DialogTitle>
                    <DialogDescription>Ask me anything!</DialogDescription>
                </DialogHeader>
                <div className="w-full max-w-lg p-4 shadow-lg rounded-2xl">
                    <CardContent className="flex flex-col space-y-2 h-96 overflow-y-auto p-4 bg-gray-100 rounded-xl">
                        {messages.map((msg, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className={`p-2 rounded-lg max-w-xs ${msg.sender === "user" ? "bg-blue-500 text-white self-end" : "bg-gray-300 text-black self-start"}`}
                            >
                                {msg.text}
                            </motion.div>
                        ))}
                    </CardContent>
                    <div className="flex items-center space-x-2 p-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-grow"
                        />
                        <Button onClick={handleSendMessage} className="p-2">
                            <Send size={20} />
                        </Button>
                    </div>
                </div>
                <DialogClose asChild>
                    <Button className={cn("mt-4", poppins.className)}>Close</Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
};

export default ChatbotPage;