import { z } from "zod";
import { createCategorySchema } from "../schemas/categories.schemas";
import { categorySchema } from "../schemas/categories.schemas";

export type Category = z.infer<typeof categorySchema>;

export type CreateCategory = z.infer<typeof createCategorySchema>;