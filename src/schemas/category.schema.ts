import capitalizeFirstCharacter from "@/utils/formatters/capitalizeFirstCharacter";
import z from "zod";

import { createCategoryAttributeSchema } from "./categoryAttribute.schema";

export const embeddedCreateCategorySchema = z.object({
  name: z.string().trim().transform(capitalizeFirstCharacter),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  attributes: z.array(createCategoryAttributeSchema.omit({ categoryId: true })),
});

export const embeddedUpdateCategorySchema = z.object({
  id: z.string().uuid("ID de catégorie non valide"),
  name: z.string().trim().transform(capitalizeFirstCharacter),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  attributes: z.array(createCategoryAttributeSchema.omit({ categoryId: true })),
});

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Le nom est requis")
    .trim()
    .transform(capitalizeFirstCharacter),
  description: z.string().optional(),
  attributeIds: z.array(z.string()),
  primaryAttributeId: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const updateCategorySchema = z.object({
  id: z.string().uuid("ID de catégorie non valide"),
  name: z
    .string()
    .min(1, "Le nom est requis")
    .trim()
    .transform(capitalizeFirstCharacter),
  description: z.string().optional(),
  attributeIds: z.array(z.string()),
  primaryAttributeId: z.string().optional(),
  isActive: z.boolean().default(true),
});
