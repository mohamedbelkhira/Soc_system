import z from "zod";

import {
  createCategoryAttributeSchema,
  deleteCategoryAttributeSchema,
  findCategoryAttributeByIdSchema,
  updateCategoryAttributeSchema,
} from "../schemas/categoryAttribute.schema";
import { Attribute } from "./attribute.dto";
import { Category } from "./category.dto";

export type CategoryAttribute = {
  id: string;
  categoryId: string;
  attributeId: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;

  category: Category;
  attribute: Attribute;
};
export type CreateCategoryAttributeDTO = z.infer<
  typeof createCategoryAttributeSchema
>;
export type UpdateCategoryAttributeDTO = z.infer<
  typeof updateCategoryAttributeSchema
>;
export type DeleteCategoryAttributeDTO = z.infer<
  typeof deleteCategoryAttributeSchema
>;
export type FindCategoryAttributeByIdDTO = z.infer<
  typeof findCategoryAttributeByIdSchema
>;
