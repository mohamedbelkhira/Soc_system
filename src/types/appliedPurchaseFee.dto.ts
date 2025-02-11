import z from "zod";

import {
  createAppliedPurchaseFeeSchema,
  deleteAppliedPurchaseFeeSchema,
  updateAppliedPurchaseFeeSchema,
} from "../schemas/appliedPurchaseFee.schema";
import { PurchaseFee } from "./purchaseFee.dto";

export interface AppliedPurchaseFee {
  id: string;
  amount: number;
  purchaseId: string;
  purchaseFeeId: string;
  purchaseFee: PurchaseFee;
  createdAt: string;
  updatedAt: string;
}

export type CreateAppliedPurchaseFeeDTO = z.infer<
  typeof createAppliedPurchaseFeeSchema
>;
export type UpdateAppliedPurchaseFeeDTO = z.infer<
  typeof updateAppliedPurchaseFeeSchema
>;
export type DeleteAppliedPurchaseFeeDTO = z.infer<
  typeof deleteAppliedPurchaseFeeSchema
>;
