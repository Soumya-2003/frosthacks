import { z } from "zod";



export const journalSchema = z.object({
    date: z.date(),
    content: z.string().min(50, "Minimum 50 words required.").max(500, "Journal can contain maximum 500 words.")
})