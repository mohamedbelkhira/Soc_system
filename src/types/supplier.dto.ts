import { z } from "zod";

// Zod Schemas
export const createSupplierSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  description: z.string(),
  phoneNumber: z.string().regex(/^\+?[0-9]{10,14}$/, "Format de numéro de téléphone invalide").optional(),
  address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  isActive: z.boolean().optional().default(true),
});

export const updateSupplierSchema = z.object({
  id: z.string().uuid("ID du fournisseur invalid"),
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères").optional(),
  description: z.string().optional(),
  phoneNumber: z.string().regex(/^\+?[0-9]{10,14}$/, "Format de numéro de téléphone invalide").optional(),
  address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères").optional(),
  isActive: z.boolean().optional(),
});

export const deleteSupplierSchema = z.object({
  id: z.string().uuid("ID du fournisseur invalid"),
});

// Type Inference
export type CreateSupplierDTO = z.infer<typeof createSupplierSchema>;
export type UpdateSupplierDTO = z.infer<typeof updateSupplierSchema>;
export type DeleteSupplierDTO = z.infer<typeof deleteSupplierSchema>;

// Supplier Interface
export interface Supplier {
  id: string;
  name: string;
  description: string;
  phoneNumber: string;
  address: string;
  isActive: boolean;
}