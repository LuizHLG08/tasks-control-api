import { NextFunction, Request, Response } from "express";
import { prisma } from "../database/prisma";
import { AppError } from "../errors/appError";
import { injectable } from "tsyringe";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

@injectable()
export class UsersMiddlewares {
    async verifyEmail(req : Request, res : Response, next : NextFunction) {
        const user = await prisma.user.findFirst({
            where : {email : req.body.email}
        });

        if(user) {
            throw new AppError(409, "This email is already registered");
        }
        next();
    }

    async verifyToken(req : Request, res : Response, next : NextFunction) {
        const authorization = req.headers.authorization;

        if(!authorization) {
            throw new AppError(401, "Token is required!");
        }

        const token = authorization.replace("Bearer ", "");

        if(!token) {
            throw new AppError(401, "Token is required!");
        }

        const secret = process.env.JWT_SECRET as string;

        jwt.verify(token, secret);

        res.locals.decode = jwt.decode(token);
        next();
    }


    async isLoginBodyValid(req : Request, res : Response, next : NextFunction) {
        const user = await prisma.user.findFirst({
            where: { email: req.body.email }
        });

        if (!user) {
            throw new AppError(404, "User not exists")
        }

        const compare = await bcrypt.compare(req.body.password, user.password)

        if (!compare) {
            throw new AppError(401,"Email and password does not match.")
        }

        next();
    }

}