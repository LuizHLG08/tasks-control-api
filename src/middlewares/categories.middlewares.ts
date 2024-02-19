import { NextFunction, Request, Response } from "express";
import { injectable } from "tsyringe";
import { prisma } from "../database/prisma";
import { AppError } from "../errors/appError";

@injectable()
export class CategoriesMiddlewares {
    async isCategoryIdValid(req : Request, res : Response, next : NextFunction) {
        const verify = await prisma.category.findFirst({
            where : {id : +req.params.id}
        });

        if(!verify) {
            throw new AppError(404, "Category not found");
        }
        next();
    }

    async isCategoryOwner(req : Request, res : Response, next : NextFunction) {

        const userId = res.locals.decode.id;

        const category = await prisma.category.findFirst({
            where: {
                id : +req.params.id,
            }
        });

        if(category?.userId != userId) {
            throw new AppError(403, "This user is not the category owner")
        }
        next();
    }
    
}