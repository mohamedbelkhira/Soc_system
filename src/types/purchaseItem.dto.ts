import z from "zod";

import {
  createPurchaseItemSchema,
  deletePurchaseItemSchema,
  updatePurchaseItemSchema,
} from "../schemas/purchaseItem.schema";
import { Purchase } from "./purchase.dto";
import { Variant } from "./variant.dto";

export type CreatePurchaseItemDTO = z.infer<typeof createPurchaseItemSchema>;
export type UpdatePurchaseItemDTO = z.infer<typeof updatePurchaseItemSchema>;
export type DeletePurchaseItemDTO = z.infer<typeof deletePurchaseItemSchema>;

export interface PurchaseItem {
  id: string;
  quantity: number;
  unitCost: number;
  purchaseId: string;
  purchase: Purchase;
  variantId: string;
  createdAt: string;
  updatedAt: string;
  variant: Variant;
}
