import z from "zod";

import {
  StoreSaleStatus,
  createStoreSaleSchema,
  deleteStoreSaleSchema,
  embeddedCreateStoreSaleSchema,
  embeddedUpdateStoreSaleSchema,
  findStoreSaleByIdSchema,
  updateStoreSaleSchema,
} from "../../schemas/sales/store-sale.schema";
import { Client } from "../clients/client.dto";
import { Sale } from "./sale.dto";

export type StoreSale = {
  id: string;
  saleId: string;
  clientId?: string | null;
  client: Client;
  status: StoreSaleStatus;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  canceledAt?: Date;

  sale: Sale;
};

export type EmbeddedCreateStoreSaleDTO = z.infer<
  typeof embeddedCreateStoreSaleSchema
>;

export type EmbeddedUpdateStoreSaleDTO = z.infer<
  typeof embeddedUpdateStoreSaleSchema
>;

export type CreateStoreSaleDTO = z.infer<typeof createStoreSaleSchema>;
export type UpdateStoreSaleDTO = z.infer<typeof updateStoreSaleSchema>;
export type DeleteStoreSaleDTO = z.infer<typeof deleteStoreSaleSchema>;
export type FindStoreSaleByIdDTO = z.infer<typeof findStoreSaleByIdSchema>;
