import { z } from "zod";

export const createPurchaseSchema = z.object({
  supplierId: z.string().uuid("ID du fournisseur non valide"),
  description: z.string().optional(),
  state: z.enum(["ORDERED", "RECEIVED"]),
  orderedAt: z.string().optional(),
  receivedAt: z.string().optional(),
  totalAmount: z.number().min(0, "Le montant totale est obligatoire"),
  costPerKg: z
    .number()
    .nonnegative("Le coût par kg doit etre positif")
    .optional(), //Rigl
});

export const updatePurchaseSchema = z.object({
  id: z.string().uuid("Invalid purchase ID"),
  supplierId: z.string().uuid("Invalid supplier ID"),
  description: z.string().optional(),
  state: z.enum(["ORDERED", "RECEIVED", "CANCELED"]),
  orderedAt: z.string().datetime().optional().nullable(),
  receivedAt: z.string().datetime().optional().nullable(),
  canceledAt: z.string().datetime().optional().nullable(),
  totalAmount: z.number().min(0, "Total amount must be positive"),
  costPerKg: z
    .number()
    .nonnegative("Le coût par kg doit etre positif")
    .optional(), //Rigl
});

export const deletePurchaseSchema = z.object({
  id: z.string().uuid("Invalid purchase ID"),
});
