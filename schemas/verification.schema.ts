import * as z from "zod";

export const emailVerificationSchema = z.object({
    otp: z.string().length(6, { message: "OTP must be 6 digits" }).regex(/^\d+$/, { message: "OTP must be numeric" }),
});
