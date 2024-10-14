import {z} from "zod"


export const messageSchema = z.object({
    content: z
    .string()
    .min(10,{message: 'Content must be at least 10 charachter long'})
    .max(300,{message:"Only 300 words long"})
})