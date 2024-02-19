import { z } from "zod";
import { categorySchema } from "./categories.schemas";

export const userSchema = z.object({
    id: z.number().min(1),
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(3)
});

export const registerUserSchema = userSchema.omit({id : true})

export const loginUserSchema = userSchema.omit({id : true, name : true})

export const responseUserSchema = userSchema.omit({password : true})

export const responseLoginSchema = z.object({
    accessToken: z.string().min(1),
    user : responseUserSchema
})