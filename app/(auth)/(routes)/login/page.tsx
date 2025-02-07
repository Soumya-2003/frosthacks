"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Eye, EyeOff } from "lucide-react";
import { loginSchema } from "@/schemas/login.schema";
import { useToast } from "@/hooks/use-toast";
import { APP_NAME } from "@/helpers/constants";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginForm = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            identifier: "",
            password: ""
        }
    });

    const onSubmit = async(data: z.infer<typeof loginSchema>) => {
        setIsSubmitting(true);
        console.log("Login Data: ",data);

        try {
            const res = await signIn('credentials',{
                redirect: false,
                identifier: data.identifier,
                password: data.password
            })

            console.log("Login response: ",res);

            if(res?.status === 200){
                toast({
                    title: "Hurray!!",
                    description: "Logged in successfully."
                })
                router.replace('/dashboard');
            }

            setIsSubmitting(false);
        } catch (error) {
            console.log("Login error: ",error)
            toast({
                title: "Oops!!",
                description: "Something went wrong."
            })
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
            <h1 className="text-2xl md:text-4xl font-bold text-center mb-6">Welcome Back to {APP_NAME}</h1>
            <Card className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl p-6 shadow-lg">
                <CardHeader className="text-lg md:text-2xl font-bold text-center">Login</CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {/* Email Field */}
                            <FormField
                                control={form.control}
                                name="identifier"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label>Email</Label>
                                        <FormControl>
                                            <Input type="email" {...field} placeholder="Enter your email" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Password Field */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label>Password</Label>
                                        <div className="relative">
                                            <FormControl>
                                                <Input
                                                    type={passwordVisible ? "text" : "password"}
                                                    {...field}
                                                    placeholder="Enter your password"
                                                />
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

                            {/* Submit Button */}
                            <CardFooter className="flex flex-col gap-4 mt-4">
                                <Button type="submit" className="w-full">Login</Button>
                                <p className="text-center text-sm text-gray-600">
                                    Don't have an account?{" "}
                                    <a href="/register" className="text-blue-600 hover:underline">
                                        Sign up
                                    </a>
                                </p>
                            </CardFooter>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginForm;
