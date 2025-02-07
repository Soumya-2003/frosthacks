import * as z from "zod";

// Define Form Schema Using Zod
export const registerSchema = z
    .object({
        username: z.string().min(3, "Username must be at least 3 characters"),
        email: z.string().email("Invalid email"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string().min(6, "Confirm Password is required"),
        age: z.preprocess(
            (val) => (val ? Number(val) : undefined),
            z.number().min(13, "Must be at least 13 years old").max(100, "Invalid age")
        ),
        gender: z.enum(["male", "female", "other"], {
            required_error: "Please select a gender",
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });