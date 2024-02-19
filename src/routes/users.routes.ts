import { Router } from "express";
import { container } from "tsyringe";
import { UsersControllers } from "../controllers/users.controllers";
import { UsersServices } from "../services/users.services";
import { ZodMiddlewares } from "../middlewares/zod.middlewares";
import { loginUserSchema, registerUserSchema } from "../schemas/users.schemas";
import { UsersMiddlewares } from "../middlewares/users.middlewares";


export const usersRouter = Router();

container.registerSingleton("UsersServices", UsersServices);
const usersControllers = container.resolve(UsersControllers);
const usersMiddlewares = container.resolve(UsersMiddlewares);

usersRouter.post("/",
    ZodMiddlewares.verifyRequest(registerUserSchema),
    (req, res, next) => usersMiddlewares.verifyEmail(req, res, next),
    (req, res) => usersControllers.register(req, res)
);

usersRouter.post("/login",
    (req, res, next) => usersMiddlewares.isLoginBodyValid(req, res, next),
    (req, res) => usersControllers.login(req, res)
);

usersRouter.get("/profile",
    (req, res, next) => usersMiddlewares.verifyToken(req, res, next),
    (req, res) => usersControllers.getProfile(req, res)
)