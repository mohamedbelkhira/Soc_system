import { z } from "zod";
import { embeddedCreateSaleSchema } from "./sale.schema";

export enum AdvanceSaleStatus {
  COMPLETED = "COMPLETED",
  PENDING = "PENDING",
  CANCELED = "CANCELED",
}

export const embeddedCreateAdvanceSaleSchema = z.object({
  sale: embeddedCreateSaleSchema,
  clientId: z.string().min(1, "ID de client non valide"),
  paidAmount: z.number().nonnegative("Le montant payé doit être positif"),
  status: z.nativeEnum(AdvanceSaleStatus),
});

export const embeddedUpdateAdvanceSaleSchema = z.object({
  id: z.string().uuid("ID de vente en magasin non valide"),
  sale: embeddedCreateSaleSchema,
  clientId: z.string().min(1, "ID de client non valide"),
  paidAmount: z.number().nonnegative("Le montant payé doit être positif"),
  status: z.nativeEnum(AdvanceSaleStatus),
});
export const createAdvanceSaleSchema = z.object({
  saleId: z.string().uuid("Id de vente non valide"),
  clientId: z.string().uuid("ID de client non valide"),
  paidAmount: z.number().positive("Le montant payé doit être positif"),
  status: z.nativeEnum(AdvanceSaleStatus),
});

export const updateAdvanceSaleSchema = z.object({
  id: z.string().uuid("ID de vente anticipée non valide"),
  saleId: z.string().uuid("Id de vente non valide"),
  clientId: z.string().uuid("ID de client non valide").optional(),
  paidAmount: z
    .number()
    .positive("Le montant payé doit être positif")
    .optional(),
  status: z.nativeEnum(AdvanceSaleStatus).optional(),
});

export const deleteAdvanceSaleSchema = z.object({
  id: z.string().uuid("ID de vente anticipée non valide"),
});

export const findAdvanceSaleByIdSchema = z.object({
  id: z.string().uuid("ID de vente anticipée non valide"),
});
