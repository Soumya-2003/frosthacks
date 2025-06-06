import * as z from "zod";

export const loginSchema = z.object({
    identifier: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});