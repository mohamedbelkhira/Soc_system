import z from "zod";

import {
  createPurchaseSchema,
  deletePurchaseSchema,
  updatePurchaseSchema,
} from "../schemas/purchase.schema";
import { AppliedPurchaseFee } from "./appliedPurchaseFee.dto";
import { PurchaseItem } from "./purchaseItem.dto";
import { Supplier } from "./supplier.dto";

export interface Purchase {
  id: string;
  description: string;
  supplierId: string;
  state: string;
  orderedAt: string | null;
  receivedAt: string | null;
  canceledAt: string | null;
  totalAmount: number;
  costPerKg: number;
  supplier: Supplier;
  appliedFees: AppliedPurchaseFee[];
  purchaseItems: PurchaseItem[];
  createdAt: string;
  updatedAt: string;
}

export type CreatePurchaseDTO = z.infer<typeof createPurchaseSchema>;
export type UpdatePurchaseDTO = z.infer<typeof updatePurchaseSchema>;
export type DeletePurchaseDTO = z.infer<typeof deletePurchaseSchema>;
