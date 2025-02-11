import { z } from "zod";

// Zod Schemas
export const createPurchaseFeeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  description: z.string(),
  isActive: z.boolean().optional().default(true),
});

// Remove 'id' from the update schema to align with form data
export const updatePurchaseFeeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long").optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const deletePurchaseFeeSchema = z.object({
  id: z.string().uuid("Invalid purchase fee ID"),
});

// Type Inference
export type CreatePurchaseFeeDTO = z.infer<typeof createPurchaseFeeSchema>;
export type UpdatePurchaseFeeDTO = z.infer<typeof updatePurchaseFeeSchema>;
export type DeletePurchaseFeeDTO = z.infer<typeof deletePurchaseFeeSchema>;

// Purchase Fee Interface
export interface PurchaseFee {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
}
