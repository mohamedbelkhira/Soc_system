import { z } from "zod";

import { saleItemSchema } from "./sale-item.schema";

export enum SaleType {
  STORE = "STORE",
  ONLINE = "ONLINE",
  ADVANCE = "ADVANCE",
}

export enum SaleCategory {
  RETAIL = "RETAIL",
  BULK = "BULK",
}
export const embeddedCreateSaleSchema = z.object({
  locationId: z.string().uuid("ID de localisation non valide").nullable(),
  type: z.nativeEnum(SaleType),
  category: z.nativeEnum(SaleCategory).optional().default(SaleCategory.RETAIL),
  saleItems: z.array(saleItemSchema),
  employeeId: z.string().uuid("ID d'employé non valide"),
  totalAmount: z.number().nonnegative("Le montant total doit être positif"),
  discountAmount: z
    .number()
    .nonnegative("Le montant de remise doit être positif")
    .nullable(),
});

export const embeddedUpdateSaleSchema = z.object({
  id: z.string().uuid("ID de vente non valide"),
  type: z.nativeEnum(SaleType),
  category: z.nativeEnum(SaleCategory).optional().default(SaleCategory.RETAIL),
  saleItems: z.array(saleItemSchema),
  employeeId: z.string().uuid("ID d'employé non valide"),
  totalAmount: z.number().positive("Le montant total doit être positif"),
  discountAmount: z
    .number()
    .nonnegative("Le montant de remise doit être positif")
    .nullable(),
});

export const createSaleSchema = z.object({
  type: z.nativeEnum(SaleType),
  category: z.nativeEnum(SaleCategory).optional().default(SaleCategory.RETAIL),
  stockMovementId: z.string().uuid("ID de mouvement de stock non valide"),
  employeeId: z.string().uuid("ID d'employé non valide"),
  totalAmount: z.number().positive("Le montant total doit être positif"),
  discountAmount: z
    .number()
    .positive("Le montant de remise doit être positif")
    .optional(),
});

export const updateSaleSchema = z.object({
  id: z.string().uuid("ID de vente non valide"),
  reference: z.string().min(1, "La référence est requise").optional(),
  type: z.nativeEnum(SaleType).optional(),
  category: z.nativeEnum(SaleCategory).optional(),
  stockMovementId: z
    .string()
    .uuid("ID de mouvement de stock non valide")
    .optional(),
  employeeId: z.string().uuid("ID d'employé non valide").optional(),
  totalAmount: z
    .number()
    .positive("Le montant total doit être positif")
    .optional(),
  discountAmount: z
    .number()
    .positive("Le montant de remise doit être positif")
    .optional(),
});

export const deleteSaleSchema = z.object({
  id: z.string().uuid("ID de vente non valide"),
});

export const findSaleByIdSchema = z.object({
  id: z.string().uuid("ID de vente non valide"),
});

export const findSaleByReferenceSchema = z.object({
  reference: z.string().min(1, "La référence est requise"),
});
