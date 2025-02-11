import z from "zod";
import {
  createAdvanceSaleSchema,
  embeddedCreateAdvanceSaleSchema,
  embeddedUpdateAdvanceSaleSchema,
  updateAdvanceSaleSchema,
  deleteAdvanceSaleSchema,
  findAdvanceSaleByIdSchema,
  AdvanceSaleStatus,
} from "@/schemas/sales/advance-sale.schema";
import { Sale } from "./sale.dto";
import { Client } from "../clients/client.dto";

export type AdvanceSale = {
  id: string;
  saleId: string;
  clientId: string;
  paidAmount: number;
  status: AdvanceSaleStatus;
  createdAt: Date;
  updatedAt: Date;

  client: Client;
  sale: Sale;
};

export type EmbeddedCreateAdvanceSaleDTO = z.infer<
  typeof embeddedCreateAdvanceSaleSchema
>;

export type EmbeddedUpdateAdvanceSaleDTO = z.infer<
  typeof embeddedUpdateAdvanceSaleSchema
>;
export type CreateAdvanceSaleDTO = z.infer<typeof createAdvanceSaleSchema>;
export type UpdateAdvanceSaleDTO = z.infer<typeof updateAdvanceSaleSchema>;
export type DeleteAdvanceSaleDTO = z.infer<typeof deleteAdvanceSaleSchema>;
export type FindAdvanceSaleByIdDTO = z.infer<typeof findAdvanceSaleByIdSchema>;
