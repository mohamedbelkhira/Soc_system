import capitalizeFirstCharacter from "@/utils/formatters/capitalizeFirstCharacter";
import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom est requis")
    .trim()
    .transform(capitalizeFirstCharacter),
  description: z.string().optional(),
  brand: z.string().min(1, "La marque est requise"),
  weight: z.number().min(0, "Le poids doit être positif"),
  retailPrice: z.number().nonnegative("Le prix de vente doit être positif"),
  wholesalePrice: z
    .number()
    .nonnegative("Le prix de gros doit être positif")
    .default(0),
  categoryId: z.string().min(1, "La catégorie est requise"),
  hasVariants: z.boolean().default(false),
  isActive: z.boolean().default(true),
  images: z.any().optional(),
});

export const updateProductSchema = z.object({
  id: z.string().uuid("ID de produit non valide"),
  name: z
    .string()
    .min(1, "Le nom est requis")
    .trim()

    .transform(capitalizeFirstCharacter),

  description: z.string().optional(),
  brand: z.string().min(1, "La marque est requise"),
  weight: z.number().min(0, "Le poids doit être positif"),
  retailPrice: z.number().nonnegative("Le prix de vente doit être positif"),
  wholesalePrice: z
    .number()
    .nonnegative("Le prix de gros doit être positif")
    .default(0),
  categoryId: z.string().min(1, "La catégorie est requise"),
  hasVariants: z.boolean().default(false),
  isActive: z.boolean().default(true),
  images: z.any().optional(),
});

export const deleteProductSchema = z.object({
  id: z.string().uuid("ID de produit non valide"),
});

export const findProductByIdSchema = z.object({
  id: z.string().uuid("ID de produit non valide"),
});
