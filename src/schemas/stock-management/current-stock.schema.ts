import { z } from "zod";

export const createCurrentStockSchema = z.object({
  locationId: z.string().uuid("ID de localisation non valide"),
  purchaseItemId: z.string().uuid("ID d'article d'achat non valide"),
  productId: z.string().uuid("ID de produit non valide"),
  variantId: z.string().uuid("ID de variante non valide"),
  quantity: z.number().int("La quantité doit être un nombre entier"),
});

export const updateCurrentStockSchema = z.object({
  locationId: z.string().uuid("ID de localisation non valide"),
  purchaseItemId: z.string().uuid("ID d'article d'achat non valide"),
  productId: z.string().uuid("ID de produit non valide"),
  variantId: z.string().uuid("ID de variante non valide"),
  quantity: z.number().int("La quantité doit être un nombre entier"),
});

export const updateStockSchema = z.object({
  locationId: z.string().uuid("ID de localisation non valide"),
  purchaseItemId: z.string().uuid("ID d'article d'achat non valide"),
  quantityChange: z.number().int("La quantité doit être un nombre entier"),
});

export const deleteCurrentStockSchema = z.object({
  locationId: z.string().uuid("ID de localisation non valide"),
  purchaseItemId: z.string().uuid("ID d'item d'achat non valide")
});

export const findCurrentStockByIdSchema = z.object({
  locationId: z.string().uuid("ID de localisation non valide"),
  purchaseItemId: z.string().uuid("ID d'item d'achat non valide")
});

export const findCurrentStockByLocationAndProductSchema = z.object({
  locationId: z.string().uuid("ID de localisation non valide"),
  productId: z.string().uuid("ID de produit non valide"),
});

export const findCurrentStockByLocationAndVariantSchema = z.object({
  locationId: z.string().uuid("ID de localisation non valide"),
  variantId: z.string().uuid("ID de variante non valide"),
});

export const updateCurrentStockQuantitySchema = z.object({
  id: z.string().uuid("ID de stock courant non valide"),
  quantity: z.number().int("La quantité doit être un nombre entier"),
});

export const findCurrentStockByProductSchema = z.object({
  productId: z.string().uuid("ID de produit non valide"),
});
