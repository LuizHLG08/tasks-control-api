import { Router } from "express";
import { container } from "tsyringe";
import { CategoriesServices } from "../services/categories.services";
import { CategoriesControllers } from "../controllers/categories.controllers";
import { ZodMiddlewares } from "../middlewares/zod.middlewares";
import { createCategorySchema } from "../schemas/categories.schemas";
import { CategoriesMiddlewares } from "../middlewares/categories.middlewares";
import { UsersMiddlewares } from "../middlewares/users.middlewares";

export const categoriesRouter = Router();

container.registerSingleton("CategoriesServices", CategoriesServices);

const categoriesControllers = container.resolve(CategoriesControllers);
const categoriesMiddlewares = container.resolve(CategoriesMiddlewares);
const usersMiddlewares = container.resolve(UsersMiddlewares);

categoriesRouter.post("/",
    (req, res, next) => usersMiddlewares.verifyToken(req, res, next),
    ZodMiddlewares.verifyRequest(createCategorySchema),
    (req, res) => categoriesControllers.createCategory(req, res)
);

categoriesRouter.delete("/:id",
    (req, res, next) => usersMiddlewares.verifyToken(req, res, next),
    (req, res, next) => categoriesMiddlewares.isCategoryIdValid(req, res, next),
    (req, res, next) => categoriesMiddlewares.isCategoryOwner(req, res, next),
    (req, res) => categoriesControllers.deleteCategory(req, res)
);