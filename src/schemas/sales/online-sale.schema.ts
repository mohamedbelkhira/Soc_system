import { env } from "@/config/environment";
import { z } from "zod";

import {
  embeddedCreateSaleSchema,
  embeddedUpdateSaleSchema,
} from "./sale.schema";

export enum OnlineSaleStatus {
  COMPLETED = "COMPLETED",
  PENDING = "PENDING",
  RETURNED = "RETURNED",
  CANCELED = "CANCELED",
}

const createDeliveryHandlerValidation = () => {
  return env.ENABLE_OPTIONAL_DELIVERY_HANDLER
    ? z.string().nullable()
    : z.string().uuid("ID du gestionnaire de livraison non valide");
};

export const embeddedCreateOnlineSaleSchema = z.object({
  sale: embeddedCreateSaleSchema,
  trackingNumber: z.string().optional(),
  clientId: z.string().uuid("ID de client non valide"),
  deliveryHandlerId: createDeliveryHandlerValidation(),
  channelId: z.string().uuid("ID du canal de vente non valide"),
  status: z.nativeEnum(OnlineSaleStatus),
  deliveryCost: z
    .number()
    .nonnegative("Les frais de livraison doivent être positifs ou nuls")
    .optional(),
  returnCost: z
    .number()
    .nonnegative("Les frais de retour doivent être positifs ou nuls")
    .optional(),
  completedAt: z.string().datetime().optional(),
  returnedAt: z.string().datetime().optional(),

  canceledAt: z.string().datetime().optional(),
});

export const embeddedUpdateOnlineSaleSchema = z.object({
  id: z.string().uuid("ID de vente en magasin non valide"),
  sale: embeddedUpdateSaleSchema,
  trackingNumber: z.string().optional(),
  clientId: z.string().uuid("ID de client non valide"),
  deliveryHandlerId: createDeliveryHandlerValidation(),
  channelId: z.string().uuid("ID du canal de vente non valide"),
  status: z.nativeEnum(OnlineSaleStatus),
  deliveryCost: z
    .number()
    .nonnegative("Les frais de livraison doivent être positifs ou nuls")
    .optional(),
  returnCost: z
    .number()
    .nonnegative("Les frais de retour doivent être positifs ou nuls")
    .optional(),
  completedAt: z.string().datetime().optional(),
  returnedAt: z.string().datetime().optional(),
  canceledAt: z.string().datetime().optional(),
});

export const createOnlineSaleSchema = z.object({
  saleId: z.string().uuid("Id de vente non valide"),
  trackingNumber: z.string().optional(),
  clientId: z.string().uuid("ID de client non valide"),
  deliveryHandlerId: createDeliveryHandlerValidation(),
  channelId: z.string().uuid("ID du canal de vente non valide"),
  status: z.nativeEnum(OnlineSaleStatus),
  deliveryCost: z
    .number()
    .nonnegative("Les frais de livraison doivent être positifs ou nuls")
    .optional(),
  returnCost: z
    .number()
    .nonnegative("Les frais de retour doivent être positifs ou nuls")
    .optional(),
  completedAt: z.string().datetime().optional(),
  returnedAt: z.string().datetime().optional(),
  canceledAt: z.string().datetime().optional(),
});

export const updateOnlineSaleSchema = z.object({
  id: z.string().uuid("ID de vente en ligne non valide"),
  saleId: z.string().uuid("Id de vente non valide"),
  trackingNumber: z.string().optional(),
  clientId: z.string().uuid("ID de client non valide").optional(),
  deliveryHandlerId: createDeliveryHandlerValidation(),
  channelId: z.string().uuid("ID du canal de vente non valide").optional(),
  status: z.nativeEnum(OnlineSaleStatus),
  deliveryCost: z
    .number()
    .nonnegative("Les frais de livraison doivent être positifs ou nuls")
    .optional(),
  returnCost: z
    .number()
    .nonnegative("Les frais de retour doivent être positifs ou nuls")
    .optional(),
  completedAt: z.string().datetime().optional(),
  returnedAt: z.string().datetime().optional(),
  canceledAt: z.string().datetime().optional(),
});

export const deleteOnlineSaleSchema = z.object({
  id: z.string().uuid("ID de vente en ligne non valide"),
});

export const findOnlineSaleByIdSchema = z.object({
  id: z.string().uuid("ID de vente en ligne non valide"),
});
