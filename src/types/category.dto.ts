import z from "zod";

import {
  createCategorySchema,
  embeddedCreateCategorySchema,
  embeddedUpdateCategorySchema,
  updateCategorySchema,
} from "../schemas/category.schema";
import { CategoryAttribute } from "./categoryAttribute.dto";

export interface Category {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  categoryAttributes: CategoryAttribute[];
  createdAt: string;
  updatedAt: string;
}
export type EmbeddedCreateCategoryDTO = z.infer<
  typeof embeddedCreateCategorySchema
>;
export type EmbeddedUpdateCategoryDTO = z.infer<
  typeof embeddedUpdateCategorySchema
>;
export type CreateCategoryDTO = z.infer<typeof createCategorySchema>;
export type UpdateCategoryDTO = z.infer<typeof updateCategorySchema>;
