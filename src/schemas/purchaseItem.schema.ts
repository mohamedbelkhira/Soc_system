import { z } from "zod";

export const createPurchaseItemSchema = z.object({
  variantId: z.string().uuid("Invalid variant ID"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitCost: z.number().min(0, "Unit cost must be at least 0"),
});

export const updatePurchaseItemSchema = z.object({
  id: z.string().uuid("Invalid purchase item ID").optional(),
  purchaseId: z.string().uuid("Invalid purchase ID").optional(),
  variantId: z.string().uuid("Invalid variant ID").optional(),
  quantity: z.number().min(1, "Quantity must be at least 1").optional(),
  unitCost: z.number().min(0, "Unit cost must be at least 0").optional(),
});


export const deletePurchaseItemSchema = z.object({
  id: z.string().uuid("Invalid purchase item ID"),
});