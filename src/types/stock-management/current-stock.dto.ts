import {
  createCurrentStockSchema,
  deleteCurrentStockSchema,
  findCurrentStockByIdSchema,
  findCurrentStockByLocationAndProductSchema,
  findCurrentStockByLocationAndVariantSchema,
  findCurrentStockByProductSchema,
  updateCurrentStockQuantitySchema,
  updateCurrentStockSchema,
  updateStockSchema,
} from "@/schemas/stock-management/current-stock.schema";
import { z } from "zod";

import { Product } from "../product.dto";
import { PurchaseItem } from "../purchaseItem.dto";
import { Variant } from "../variant.dto";

export type CurrentStock = {
  locationId: string;
  purchaseItemId: string;
  productId: string;
  variantId: string;
  quantity: number;
  purchaseItem: PurchaseItem;
  product: Product;
  variant: Variant;

  createdAt: Date;
  updatedAt: Date;
};
export type CreateCurrentStockDTO = z.infer<typeof createCurrentStockSchema>;
export type UpdateCurrentStockDTO = z.infer<typeof updateCurrentStockSchema>;
export type UpdateStockDTO = z.infer<typeof updateStockSchema>;
export type DeleteCurrentStockDTO = z.infer<typeof deleteCurrentStockSchema>;
export type FindCurrentStockByIdDTO = z.infer<
  typeof findCurrentStockByIdSchema
>;
export type FindCurrentStockByLocationAndProductDTO = z.infer<
  typeof findCurrentStockByLocationAndProductSchema
>;
export type FindCurrentStockByLocationAndVariantDTO = z.infer<
  typeof findCurrentStockByLocationAndVariantSchema
>;
export type UpdateCurrentStockQuantityDTO = z.infer<
  typeof updateCurrentStockQuantitySchema
>;

export type FindCurrentStockByProductDTO = z.infer<
  typeof findCurrentStockByProductSchema
>;
