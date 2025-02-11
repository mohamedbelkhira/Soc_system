import { z } from "zod";
import {
  createStockMovementItemSchema,
  updateStockMovementItemSchema,
} from "./stock-movement-item.schema";
import { StockMovementType } from "@/types/stock-management/enums";

export const createStockMovementSchema = z.object({
  sourceLocationId: z.union([
    z.string().uuid("ID de localisation source non valide"),
    z.string().nullable(),
  ]),
  destinationLocationId: z.union([
    z.string().uuid("ID de localisation de destination non valide"),
    z.string().nullable(),
  ]),
  type: z.nativeEnum(StockMovementType),
  items: z.array(
    createStockMovementItemSchema.omit({
      stockMovementId: true,
    })
  ),
});

export const updateStockMovementSchema = z.object({
  id: z.string().uuid("ID de mouvement de stock non valide"),
  type: z.nativeEnum(StockMovementType),
  sourceLocationId: z
    .string()
    .uuid("ID de localisation source non valide")
    .optional(),
  destinationLocationId: z
    .string()
    .uuid("ID de localisation de destination non valide")
    .optional(),
  items: z.array(
    updateStockMovementItemSchema.omit({
      stockMovementId: true,
    })
  ),
});

export const deleteStockMovementSchema = z.object({
  id: z.string().uuid("ID de mouvement de stock non valide"),
});

export const findStockMovementByIdSchema = z.object({
  id: z.string().uuid("ID de mouvement de stock non valide"),
});
