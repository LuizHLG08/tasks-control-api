import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { CategoriesServices } from "../services/categories.services";

@injectable()
export class CategoriesControllers {

    constructor(@inject("CategoriesServices") private CategoriesServices : CategoriesServices) {    
    }

    async createCategory(req : Request, res : Response) : Promise<Response> {
        const userId = res.locals.decode.id;
        const response = await this.CategoriesServices.createCategory(userId, req.body);

        return res.status(201).json(response);

    }

    async deleteCategory(req : Request, res : Response) : Promise<Response> {
        const userId = res.locals.decode.id;
        await this.CategoriesServices.deleteCategory(userId,+req.params.id);

        return res.status(204).json();
    }

}