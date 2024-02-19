import { injectable } from "tsyringe";
import { prisma } from "../database/prisma";
import { Category, CreateCategory } from "../interfaces/categories.interfaces";

@injectable()
export class CategoriesServices {

    async createCategory(userId : number, data : CreateCategory) : Promise<Category> {
        return await prisma.category.create({
            data : {
                ...data,
                userId : userId
            }
        }) as Category;
    }

    async deleteCategory(userId : number, id : number) : Promise<void> {
        await prisma.category.delete({
            where : {
                id : id,
                userId : userId
            }
        });
    }

}