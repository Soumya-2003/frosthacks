"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { registerSchema } from "@/schemas/registration.schema";
import { APP_NAME } from "@/helpers/constants";
import { signIn } from 'next-auth/react'
import axios from "axios";
import { useRouter } from "next/navigation";

const RegisterForm = () => {
    const [step, setStep] = useState(1);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            age: 14,
            gender: "male", // Default gender selection to avoid undefined
        },
    });

    const onSubmit = async(data: z.infer<typeof registerSchema>) => {
        console.log("Form Submitted:", data);

        try {
            
            const res = await axios.post('/api/signup');

            if(res.status === 200){
                toast({
                    title: "Welcome abroad!!",
                    description: "Please verify your email."
                })
            }

            router.push('/verify')

        } catch (error) {
            toast({
                title: "Oops!!",
                description: "Something went wrong."
            })
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 lg:p-8">
            <h1 className="text-xl md:text-4xl font-bold text-center mb-6">Welcome to {APP_NAME}</h1>
            <Card className="w-full max-w-md p-6 shadow-lg">
                <CardHeader className="text-lg md:text-2xl font-bold text-center">Register</CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            {step === 1 && (
                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Label>Username</Label>
                                                <FormControl>
                                                    <Input {...field} placeholder="Enter username" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Label>Email</Label>
                                                <FormControl>
                                                    <Input type="email" {...field} placeholder="Enter email" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Label>Password</Label>
                                                <div className="relative">
                                                    <FormControl>
                                                        <Input type={passwordVisible ? "text" : "password"} {...field} placeholder="Enter password" />
                                                    </FormControl>
                                                    <button
                                                        type="button"
                                                        onClick={() => setPasswordVisible(!passwordVisible)}
                                                        className="absolute right-3 top-3 text-gray-500"
                                                    >
                                                        {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                                                    </button>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Label>Confirm Password</Label>
                                                <div className="relative">
                                                    <FormControl>
                                                        <Input type={confirmPasswordVisible ? "text" : "password"} {...field} placeholder="Confirm password" />
                                                    </FormControl>
                                                    <button
                                                        type="button"
                                                        onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                                                        className="absolute right-3 top-3 text-gray-500"
                                                    >
                                                        {confirmPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                                                    </button>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="age"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Label>Age</Label>
                                                <FormControl>
                                                    <Input type="number" {...field} placeholder="Enter age" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="gender"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Label>Gender</Label>
                                                <FormControl>
                                                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="male" /> <Label>Male</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="female" /> <Label>Female</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="other" /> <Label>Other</Label>
                                                        </div>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-2 text-center">
                                    <p><strong>Username:</strong> {form.watch("username")}</p>
                                    <p><strong>Email:</strong> {form.watch("email")}</p>
                                    <p><strong>Age:</strong> {form.watch("age")}</p>
                                    <p><strong>Gender:</strong> {form.watch("gender")}</p>
                                </div>
                            )}

                            <div className="flex flex-col md:flex-row justify-between gap-4 py-4 w-full">
                                <Button disabled={step === 1} size={'lg'} type="button" onClick={() => setStep(step - 1)} className="w-full md:w-auto">
                                    Back
                                </Button>
                                {step < 3 ? (
                                    <Button size={'lg'} type="button" onClick={() => setStep(step + 1)} className="w-full md:w-auto">
                                        Next
                                    </Button>
                                ) : (
                                    <Button size={'lg'} type="submit" className="w-full md:w-auto self-center">
                                        Submit
                                    </Button>
                                )}
                            </div>
                        </form>
                    </Form>
                    {
                        step !== 3 && (
                            <div
                                className="w-full"
                            >
                                <Button type="button" className="w-full" onClick={() => signIn('google', { callbackUrl: "/dashboard" })}>
                                    Sign up with Google
                                </Button>
                            </div>
                        )
                    }
                </CardContent>
            </Card>

        </div>
    );
};

export default RegisterForm;