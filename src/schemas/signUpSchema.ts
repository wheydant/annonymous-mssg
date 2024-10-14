import {z} from 'zod'


//Single verification
export const usernameValidation = z
    .string()
    .min(2, "Username must be atleast 2 charachters")
    .max(20, "Username must be atmost 20 charachters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special charachter")


//Cummulative verification thus object
export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(6,{message: "Password must be 6 charachters"})
})