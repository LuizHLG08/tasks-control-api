import { z } from "zod";
import { categorySchema } from "./categories.schemas";

export const taskSchema = z.object({
    id: z.number().min(1),
    title: z.string().min(2),
    content: z.string().min(2),
    finished: z.boolean().optional(),
    categoryId: z.number().optional(),
    category: categorySchema.optional()
});

export const createTaskSchema = taskSchema.omit({id : true, category : true});

export const updateTaskSchema = createTaskSchema.partial();