import {z} from 'zod'

export const usernameValidation = z
    .string()
    .min(2, "Username must be atleast 2 charachters")
    .max(20, "Username must be atmost 20 charachters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special charachter")

