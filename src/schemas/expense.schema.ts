import { z } from "zod";

// Schema for creating an expense
export const createExpenseSchema = z.object({
  categoryId: z.string().uuid("ID de catégorie invalide"),
  description: z.string().optional(),
  status: z.enum(["PENDING", "PAID"]),
  paidAt: z.string().datetime().nullable().optional(),
  dueAt: z.string().datetime().nullable().optional(),
  amount: z.number().positive("Le montant doit être positif"),
});

// Schema for updating an expense
export const updateExpenseSchema = z.object({
  id: z.string().uuid("ID de dépense invalide"),
  categoryId: z.string().uuid("ID de catégorie invalide").optional(),
  description: z.string().optional(),
  status: z.enum(["PENDING", "PAID", "CANCELED"]).optional(),
  paidAt: z.string().datetime().nullable().optional(),
  dueAt: z.string().datetime().nullable().optional(),
  amount: z.number().positive("Le montant doit être positif").optional(),
});

// Schema for deleting an expense
export const deleteExpenseSchema = z.object({
  id: z.string().uuid("ID de dépense invalide"),
});