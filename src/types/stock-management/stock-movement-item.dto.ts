import {
  createStockMovementItemSchema,
  deleteStockMovementItemSchema,
  findStockMovementItemByIdSchema,
  findStockMovementItemsByStockMovementIdSchema,
  updateStockMovementItemSchema,
} from "@/schemas/stock-management/stock-movement-item.schema";
import { z } from "zod";

import { PurchaseItem } from "../purchaseItem.dto";
import { Variant } from "../variant.dto";

export type PopulatedStockMovementItem = {
  purchaseItemId: string;
  purchaseItem: PurchaseItem;
  id: string;
  stockMovementId: string;
  variantId: string;
  quantity: number;
  price: number;
  variant: Variant;
  createdAt: Date;
  updatedAt: Date;
};
export type CreateStockMovementItemDTO = z.infer<
  typeof createStockMovementItemSchema
>;
export type UpdateStockMovementItemDTO = z.infer<
  typeof updateStockMovementItemSchema
>;
export type DeleteStockMovementItemDTO = z.infer<
  typeof deleteStockMovementItemSchema
>;
export type FindStockMovementItemByIdDTO = z.infer<
  typeof findStockMovementItemByIdSchema
>;
export type FindStockMovementItemsByStockMovementIdDTO = z.infer<
  typeof findStockMovementItemsByStockMovementIdSchema
>;
