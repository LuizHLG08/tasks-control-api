import { Router } from "express";
import { container } from "tsyringe";
import { TasksServices } from "../services/tasks.services";
import { TasksControllers } from "../controllers/tasks.controllers";
import { ZodMiddlewares } from "../middlewares/zod.middlewares";
import { createTaskSchema, updateTaskSchema } from "../schemas/tasks.schemas";
import { TasksMiddlewares } from "../middlewares/tasks.middlewares";
import { UsersMiddlewares } from "../middlewares/users.middlewares";

export const tasksRouter = Router();

container.registerSingleton("TasksServices", TasksServices);

const tasksControllers = container.resolve(TasksControllers);
const tasksMiddlewares = container.resolve(TasksMiddlewares);
const usersMiddlewares = container.resolve(UsersMiddlewares)

tasksRouter.post("/",
    (req, res, next) => usersMiddlewares.verifyToken(req, res, next),
    ZodMiddlewares.verifyRequest(createTaskSchema), 
    (req, res, next) => tasksMiddlewares.isCategoryIdValid(req, res, next),
    (req, res) => tasksControllers.createTask(req, res)
);

tasksRouter.get("/", 
    (req, res, next) => usersMiddlewares.verifyToken(req, res, next),
    (req, res) => tasksControllers.getTasks(req, res)
);

tasksRouter.get("/:id",
    (req, res, next) => usersMiddlewares.verifyToken(req, res, next),
    (req, res, next) => tasksMiddlewares.isTaskIdValid(req, res, next),
    (req, res) => tasksControllers.getById(req, res)
);

tasksRouter.patch("/:id",
    (req, res, next) => usersMiddlewares.verifyToken(req, res, next),
    ZodMiddlewares.verifyRequest(updateTaskSchema),
    (req, res, next) => tasksMiddlewares.isTaskIdValid(req, res, next), 
    (req, res, next) => tasksMiddlewares.isTaskOwner(req, res, next), 
    (req, res) => tasksControllers.updateTask(req, res)
);

tasksRouter.delete("/:id",
    (req, res, next) => usersMiddlewares.verifyToken(req, res, next),
    (req, res, next) => tasksMiddlewares.isTaskIdValid(req, res, next), 
    (req, res, next) => tasksMiddlewares.isTaskOwner(req, res, next), 
    (req, res) => tasksControllers.deleteTask(req, res)
);

