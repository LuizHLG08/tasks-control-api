import { z } from "zod";
import { createTaskSchema, taskSchema } from "../schemas/tasks.schemas";

export type Task = z.infer<typeof taskSchema>;

export type CreateTask = z.infer<typeof createTaskSchema>;

export type UpdateTask = z.infer<typeof createTaskSchema>;

