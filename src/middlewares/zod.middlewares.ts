import { NextFunction, Request, Response } from "express";
import { injectable } from "tsyringe";
import { AnyZodObject } from "zod";

@injectable()
export class ZodMiddlewares {
    static verifyRequest(schema : AnyZodObject) {

        return async (req : Request, res : Response, next : NextFunction) => {
            req.body = await schema.parseAsync(req.body);
           
            next();
        }

    }
}