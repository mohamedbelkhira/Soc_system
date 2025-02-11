import { z } from "zod";

import {
  createSaleSchema,
  embeddedCreateSaleSchema,
  updateSaleSchema,
} from "./sale.schema";

export enum StoreSaleStatus {
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
}

export const embeddedCreateStoreSaleSchema = z.object({
  sale: embeddedCreateSaleSchema,
  clientId: z.string().nullable(),
  status: z.nativeEnum(StoreSaleStatus),
  completedAt: z.string().datetime().optional(),
  canceledAt: z.string().datetime().optional(),
});

export const embeddedUpdateStoreSaleSchema = z.object({
  id: z.string().uuid("ID de vente en magasin non valide"),
  sale: embeddedCreateSaleSchema,
  clientId: z.string().nullable(),
  status: z.nativeEnum(StoreSaleStatus),
  completedAt: z.string().datetime().optional(),
  canceledAt: z.string().datetime().optional(),
});

export const createStoreSaleSchema = z.object({
  sale: createSaleSchema,
  clientId: z.string().nullable(),
  status: z.nativeEnum(StoreSaleStatus),
  completedAt: z.string().datetime().optional(),
  canceledAt: z.string().datetime().optional(),
});

export const updateStoreSaleSchema = z.object({
  id: z.string().uuid("ID de vente en magasin non valide"),
  sale: updateSaleSchema,
  clientId: z.string().nullable(),
  status: z.nativeEnum(StoreSaleStatus).optional(),
  completedAt: z.string().datetime().optional(),
  canceledAt: z.string().datetime().optional(),
});

export const deleteStoreSaleSchema = z.object({
  id: z.string().uuid("ID de vente en magasin non valide"),
});

export const findStoreSaleByIdSchema = z.object({
  id: z.string().uuid("ID de vente en magasin non valide"),
});

export const findStoreSaleByReferenceSchema = z.object({
  reference: z.string().uuid("Référence de vente en magasin non valide"),
});
