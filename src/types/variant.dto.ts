import z from "zod";

import {
  createVariantSchema,
  deleteVariantSchema,
  findVariantByIdSchema,
  reducedCreateVariantSchema,
  updateVariantSchema,
} from "../schemas/variant.schema";
import { AttributeValue } from "./attributeValue.dto";
import { Product } from "./product.dto";
import { CurrentStock } from "./stock-management/current-stock.dto";

export interface Variant {
  id: string;
  sku: string;
  imageUrls: string[];
  hasCustomPrice: boolean;
  retailPrice: number | null;
  wholesalePrice: number | null;
  productId: string;
  product: Product;
  attributeValues: AttributeValue[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  currentStock: CurrentStock[];
}

export type ReducedCreateVariantDTO = z.infer<
  typeof reducedCreateVariantSchema
>;
export type CreateVariantDTO = z.infer<typeof createVariantSchema>;
export type UpdateVariantDTO = z.infer<typeof updateVariantSchema>;
export type DeleteVariantDTO = z.infer<typeof deleteVariantSchema>;
export type FindVariantByIdDTO = z.infer<typeof findVariantByIdSchema>;
