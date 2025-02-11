import z from "zod";
import {
  createSaleSchema,
  updateSaleSchema,
  deleteSaleSchema,
  findSaleByIdSchema,
  findSaleByReferenceSchema,
  SaleType,
  SaleCategory,
  embeddedCreateSaleSchema,
  embeddedUpdateSaleSchema,
} from "../../schemas/sales/sale.schema";
import { Employee } from "../employee.dto";
import { PopulatedStockMovement } from "../stock-management/stock-movement.dto";

export type Sale = {
  id: string;
  reference: string;
  type: SaleType;
  category: SaleCategory;
  stockMovementId: string;
  stockMovement: PopulatedStockMovement;
  employeeId: string;
  employee: Employee;
  totalAmount: number;
  discountAmount?: number;
  createdAt: Date;
  updatedAt: Date;
};

export type EmbeddedCreateSaleDTO = z.infer<typeof embeddedCreateSaleSchema>;
export type EmbeddedUpdateSaleDTO= z.infer<typeof embeddedUpdateSaleSchema>;


export type CreateSaleDTO = z.infer<typeof createSaleSchema>;
export type UpdateSaleDTO = z.infer<typeof updateSaleSchema>;
export type DeleteSaleDTO = z.infer<typeof deleteSaleSchema>;
export type FindSaleByIdDTO = z.infer<typeof findSaleByIdSchema>;
export type FindSaleByReferenceDTO = z.infer<typeof findSaleByReferenceSchema>;
