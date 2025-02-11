import {
  createOnlineSaleChannelSchema,
  deleteOnlineSaleChannelSchema,
  findOnlineSaleChannelByIdSchema,
  updateOnlineSaleChannelSchema,
} from "@/schemas/sales/online-sale-channel.schema";
import z from "zod";

export type OnlineSaleChannel = {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateOnlineSaleChannelDTO = z.infer<
  typeof createOnlineSaleChannelSchema
>;
export type UpdateOnlineSaleChannelDTO = z.infer<
  typeof updateOnlineSaleChannelSchema
>;
export type DeleteOnlineSaleChannelDTO = z.infer<
  typeof deleteOnlineSaleChannelSchema
>;
export type FindOnlineSaleChannelByIdDTO = z.infer<
  typeof findOnlineSaleChannelByIdSchema
>;
