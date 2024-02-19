import { injectable } from "tsyringe";
import { LoginUser, RegisterUser, ResponseLogin, ResponseUser, User } from "../interfaces/users.interfaces";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../database/prisma";
import { responseUserSchema } from "../schemas/users.schemas";

@injectable()
export class UsersServices{

    async register(data : RegisterUser) : Promise<ResponseUser> {

        const hashPassword = await bcrypt.hash(data.password, 10)

        const newUser = {
            ...data,
            password : hashPassword
        }

        const response = await prisma.user.create({data : newUser})

        return responseUserSchema.parse(response)

    }

    async login(data : LoginUser) : Promise<ResponseLogin> {
        const user = await prisma.user.findFirst({
            where : {email : data.email}
        }) as User;

        const token = jwt.sign({id : user.id}, process.env.JWT_SECRET as string)

        const response : ResponseLogin = {
            accessToken : token,
            user : responseUserSchema.parse(user)
        }

        return response
    }

    async getProfile(userId : number) : Promise<ResponseUser> {
        const response = await prisma.user.findFirst({
            where : { id : userId}
        })

        return responseUserSchema.parse(response)
    }
}