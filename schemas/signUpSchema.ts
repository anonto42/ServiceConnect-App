import { z } from 'zod';

export const usernameValidation = z
    .string()
    .min(2,"Username must be atlist 2 characters") 
    .max(20,"Username will be under 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/,"Username must not contain special character")

export const signUpSchema = z
    .object(
        {
            username: usernameValidation,
            email: z.string().email({message:"Invalid email address"}),
            pasword: z.string().min(6,{message:"Inter at last 6 character"})
        }
    )