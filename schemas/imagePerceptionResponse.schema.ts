import { z } from "zod";


export const formSchema = z.object({
    response: z.string().min(5, "Response should contain minimum 5 letters.").max(50, "Response can contain maximum 50 letters.")
})