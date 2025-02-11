import z from "zod";

import {
  createProductSchema,
  deleteProductSchema,
  findProductByIdSchema,
  updateProductSchema,
} from "../schemas/product.schema";
import { Category } from "./category.dto";
import { CurrentStock } from "./stock-management/current-stock.dto";
import { Variant } from "./variant.dto";

export interface Product {
  id: string;
  name: string;
  description: string;
  brand: string;
  weight: number;
  retailPrice: number;
  wholesalePrice: number;
  imageUrls: string[];
  hasVariants: boolean;
  variants: Variant[];
  categoryId: string;
  category: Category;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  currentStock: CurrentStock[];
}
export type CreateProductDTO = z.infer<typeof createProductSchema>;
export type UpdateProductDTO = z.infer<typeof updateProductSchema>;
export type DeleteProductDTO = z.infer<typeof deleteProductSchema>;
export type FindProductByIdDTO = z.infer<typeof findProductByIdSchema>;
