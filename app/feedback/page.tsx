'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

// Schema validation using Zod
const feedbackSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    rating: z.enum(['1', '2', '3', '4', '5'], { required_error: 'Rating is required' }),
    feedback: z.string().min(10, 'Feedback must be at least 10 characters'),
});

const FeedbackForm = () => {
    const [loading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof feedbackSchema>>({ resolver: zodResolver(feedbackSchema), defaultValues: { name: '', email: '', rating: '5', feedback: '' } });
    const { toast } = useToast();

    const onSubmit = async (data: z.infer<typeof feedbackSchema>) => {
        setLoading(true);
        try {
            const response = await axios.post('/api/feedback', data);
            if (response.status === 201) {
                toast({
                    title: 'Feedback submitted successfully',
                    description: 'Thank you for your feedback!',
                });
                form.reset();
            } else {
                toast({
                    title: 'Error',
                    description: 'Failed to submit feedback',
                })
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to submit feedback',
            })
        }
        setLoading(false);
    };

    return (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="w-screen min-h-screen flex flex-col justify-center items-center mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">Feedback Form</h2>
            <Form {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 lg:w-1/3 md:1/4 sm:w-1/2 border border-black p-8 rounded-2xl">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl><Input placeholder="Your Name" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl><Input type="email" placeholder="Your Email" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="rating" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Rating</FormLabel>
                            <FormControl>
                                <select {...field} className="w-full border p-2 rounded">
                                    {[1, 2, 3, 4, 5].map((num) => (<option key={num} value={num}>{num}</option>))}
                                </select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="feedback" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Feedback</FormLabel>
                            <FormControl><Textarea placeholder="Your feedback..." {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Submitting...' : 'Submit Feedback'}</Button>
                </form>
            </Form>
        </motion.div>
    );
};

export default FeedbackForm;
