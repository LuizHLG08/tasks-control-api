import "reflect-metadata";
import "express-async-errors";
import cors from "cors";
import helmet from "helmet";
import express, { json } from "express";
import { tasksRouter } from "./routes/tasks.routes";
import { HandleErrorsMiddlewares } from "./middlewares/handleErrors.middlewares";
import { categoriesRouter } from "./routes/categories.routes";
import { usersRouter } from "./routes/users.routes";

export const app = express();

app.use(json());
app.use(helmet());
app.use(cors())
app.use("/tasks", tasksRouter);
app.use("/categories", categoriesRouter);
app.use("/users", usersRouter);
app.use(HandleErrorsMiddlewares.execute)