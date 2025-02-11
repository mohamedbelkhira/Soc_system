import { z } from "zod";

export const attributeValueSchema = z.object({
  attributeId: z.string(),
  value: z
    .union([z.string(), z.number()])
    .transform((value) =>
      typeof value === "number" ? value.toString() : value
    ),
});

export const reducedCreateVariantSchema = z.object({
  attributeValues: z.record(z.array(z.string())),
});

export const createVariantSchema = z.object({
  sku: z.string().optional(),
  imageUrls: z.array(z.string().url("URL d'image invalide")).optional(),
  hasCustomPrice: z.boolean().optional(),
  retailPrice: z
    .number()
    .min(0, "Le prix de vente doit être positif")
    .optional(),
  wholesalePrice: z
    .number()
    .min(0, "Le prix de gros doit être positif")
    .optional(),
  productId: z.string().uuid("ID de produit non valide"),
  attributeValues: z.array(attributeValueSchema),
  isActive: z.boolean().optional(),
});

export const updateVariantSchema = z.object({
  id: z.string().uuid("ID de variante non valide"),
  sku: z.string().min(1, "SKU est requis").optional(),
  imageUrls: z.array(z.string().url("URL d'image invalide")).optional(),
  hasCustomPrice: z.boolean().optional(),
  retailPrice: z
    .number()
    .min(0, "Le prix de vente doit être positif")
    .optional(),
  wholesalePrice: z
    .number()
    .min(0, "Le prix de gros doit être positif")
    .optional(),
  productId: z.string().uuid("ID de produit non valide"),
  attributeValues: z.array(attributeValueSchema),
  isActive: z.boolean(),
});

export const deleteVariantSchema = z.object({
  id: z.string().uuid("ID de variante non valide"),
});

export const findVariantByIdSchema = z.object({
  id: z.string().uuid("ID de variante non valide"),
});
