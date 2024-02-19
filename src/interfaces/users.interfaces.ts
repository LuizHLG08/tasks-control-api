import { z } from "zod";
import { loginUserSchema, registerUserSchema, responseLoginSchema, responseUserSchema, userSchema } from "../schemas/users.schemas";

export type User = z.infer<typeof userSchema>;
export type RegisterUser = z.infer<typeof registerUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type ResponseUser = z.infer<typeof responseUserSchema>;
export type ResponseLogin = z.infer<typeof responseLoginSchema>;