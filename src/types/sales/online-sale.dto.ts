import {
  OnlineSaleStatus,
  createOnlineSaleSchema,
  deleteOnlineSaleSchema,
  embeddedCreateOnlineSaleSchema,
  embeddedUpdateOnlineSaleSchema,
  findOnlineSaleByIdSchema,
  updateOnlineSaleSchema,
} from "@/schemas/sales/online-sale.schema";
import z from "zod";

import { Client } from "../clients/client.dto";
import { DeliveryHandler } from "../deliveryHandler.dto";
import { Sale } from "./sale.dto";
import { OnlineSaleChannel } from "./online-sale-channel.dto";
export type OnlineSale = {
  id: string;
  saleId: string;
  clientId: string;
  trackingNumber: string;
  deliveryHandlerId?: string;
  channelId: string;
  deliveryCost: number;
  returnCost: number;
  status: OnlineSaleStatus;
  createdAt: Date;
  updatedAt: Date;
  channel: OnlineSaleChannel;
  completedAt?: Date;
  returnedAt?: Date;
  canceledAt?: Date;

  client: Client;
  sale: Sale;
  deliveryHandler?: DeliveryHandler;
};

export type EmbeddedCreateOnlineSaleDTO = z.infer<
  typeof embeddedCreateOnlineSaleSchema
>;

export type EmbeddedUpdateOnlineSaleDTO = z.infer<
  typeof embeddedUpdateOnlineSaleSchema
>;

export type CreateOnlineSaleDTO = z.infer<typeof createOnlineSaleSchema>;
export type UpdateOnlineSaleDTO = z.infer<typeof updateOnlineSaleSchema>;
export type DeleteOnlineSaleDTO = z.infer<typeof deleteOnlineSaleSchema>;
export type FindOnlineSaleByIdDTO = z.infer<typeof findOnlineSaleByIdSchema>;
