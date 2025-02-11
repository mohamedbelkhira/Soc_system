import { z } from "zod";

export const saleItemSchema = z.object({
  productId: z.string().uuid("ID de produit non valide"),
  variantId: z.string().uuid("ID du variante non valide"),
  productName: z.string(),
  variantName: z.string(),
  price: z.number().nonnegative("Le prix doit être positif"),
  weight: z.number().nonnegative("Le poids doit être positif"),
  details: z.array(
    z.object({
      purchaseItemId: z.string().uuid("ID d'article d'achat non valide"),
      quantity: z.number().nonnegative("La quantité doit être positive"),
      unitCost: z.number().nonnegative("Le cout unitaire doit être positif"),
      costPerKg: z.number().nonnegative("Le coût par kg doit être positif"),
    })
  ),
});
