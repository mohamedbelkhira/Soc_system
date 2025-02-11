import z from "zod";

export const createCategoryAttributeSchema = z.object({
  categoryId: z.string().uuid("L'ID de la catégorie est invalide"),
  attributeId: z.string().uuid("L'ID de l'attribut est invalide"),
  isPrimary: z.boolean().default(false),
});

export const updateCategoryAttributeSchema = z.object({
  id: z.string().uuid("ID de categorie-attribut invalide"),
  isPrimary: z.boolean().default(false),
});

export const deleteCategoryAttributeSchema = z.object({
  id: z.string().uuid("ID de categorie-attribut non valide"),
});

export const findCategoryAttributeByIdSchema = z.object({
  id: z.string().uuid("ID de categorie-attribut non valide"),
});
