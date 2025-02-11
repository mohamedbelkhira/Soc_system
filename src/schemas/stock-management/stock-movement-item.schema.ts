import { z } from "zod";

export const createStockMovementItemSchema = z.object({
  stockMovementId: z.string().uuid("ID de mouvement de stock non valide"),
  purchaseItemId: z.string().uuid("ID d'article d'achat non valide"),
  variantId: z.string().uuid("ID de variante non valide"),
  quantity: z
    .number()
    .int("La quantité doit être un nombre entier")
    .positive("La quantité doit être positive"),
  price: z.number().positive("Le prix doit être positif"),
});

export const updateStockMovementItemSchema = z.object({
  id: z.string().uuid("ID d'article de mouvement de stock non valide"),
  stockMovementId: z.string().uuid("ID de mouvement de stock non valide"),
  purchaseItemId: z.string().uuid("ID d'article d'achat non valide"),
  variantId: z.string().uuid("ID de variante non valide"),
  quantity: z
    .number()
    .int("La quantité doit être un nombre entier")
    .positive("La quantité doit être positive"),
  price: z.number().positive("Le prix doit être positif"),
});

export const deleteStockMovementItemSchema = z.object({
  id: z.string().uuid("ID d'article de mouvement de stock non valide"),
});

export const findStockMovementItemByIdSchema = z.object({
  id: z.string().uuid("ID d'article de mouvement de stock non valide"),
});

export const findStockMovementItemsByStockMovementIdSchema = z.object({
  stockMovementId: z.string().uuid("ID de mouvement de stock non valide"),
});
