import { z } from "zod";

export const createAppliedPurchaseFeeSchema = z.object({
  amount: z.number().positive("Amount must be a positive number"),
  purchaseId: z.string().uuid("Invalid purchase ID"),
  purchaseFeeId: z.string().uuid("Invalid purchase fee ID"),
});

export const updateAppliedPurchaseFeeSchema = z.object({
  id: z.string().uuid("Invalid applied purchase fee ID").optional(),
  amount: z.number().positive("Amount must be a positive number"),
  purchaseId: z.string().uuid("Invalid purchase ID").optional(),
  purchaseFeeId: z.string().uuid("Invalid purchase fee ID"),
});


export const deleteAppliedPurchaseFeeSchema = z.object({
  id: z.string().uuid("Invalid applied purchase fee ID"),
});