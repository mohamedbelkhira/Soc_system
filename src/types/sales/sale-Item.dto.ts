import {
  extendedSaleItemSchema,
  saleItemSchema,
} from "@/schemas/sales/sale-item.schema";
import z from "zod";

export type ExtendedSaleItem = z.infer<typeof extendedSaleItemSchema>;
export type SaleItem = z.infer<typeof saleItemSchema>;
