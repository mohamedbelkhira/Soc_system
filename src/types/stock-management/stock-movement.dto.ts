import { z } from "zod";
import {
  createStockMovementSchema,
  updateStockMovementSchema,
  deleteStockMovementSchema,
  findStockMovementByIdSchema,
} from "@/schemas/stock-management/stock-movement.schema";
import { PopulatedStockMovementItem } from "./stock-movement-item.dto";
import { StockMovementType } from "./enums";

export type PopulatedStockMovement = {
  id: string;
  sourceLocationId: string | null;
  destinationLocationId: string | null;
  type: StockMovementType;

  items: PopulatedStockMovementItem[];
  createdAt: Date;
  updatedAt: Date;
};

export type CreateStockMovementDTO = z.infer<typeof createStockMovementSchema>;
export type UpdateStockMovementDTO = z.infer<typeof updateStockMovementSchema>;
export type DeleteStockMovementDTO = z.infer<typeof deleteStockMovementSchema>;
export type FindStockMovementByIdDTO = z.infer<
  typeof findStockMovementByIdSchema
>;
