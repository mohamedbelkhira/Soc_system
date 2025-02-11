import { z } from "zod";
  
export const createExpenseCategorySchema = z.object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 characteres"),
    description: z.string().nullable().optional(),
    type: z.literal("GLOBAL"), // Enforce type to be GLOBAL
});

export const updateExpenseCategorySchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 characteres").optional(),
  description: z.string().optional(),
  type: z.literal("GLOBAL").optional(), // Enforce type to be GLOBAL if provided
});

export const deleteExpenseCategorySchema = z.object({
    id: z.string().uuid("id de la catégorie de dépense éronné"),
});
