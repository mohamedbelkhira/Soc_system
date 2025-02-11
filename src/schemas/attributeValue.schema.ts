import { z } from "zod";

const attributeValueBaseSchema = z.object({
  value: z.string(),
  variantId: z.string().uuid("ID de variant non valide"),
  attributeId: z.string().uuid("ID d'attribut non valide"),
});

export const createAttributeValueSchema = attributeValueBaseSchema;

export const updateAttributeValueSchema = z
  .object({
    id: z.string().uuid("ID de valeur d'attribut non valide"),
  })
  .merge(attributeValueBaseSchema);

export const deleteAttributeValueSchema = z.object({
  id: z.string().uuid("ID de valeur d'attribut non valide"),
});

export const findAttributeValueByIdSchema = z.object({
  id: z.string().uuid("ID de valeur d'attribut non valide"),
});

export const findAttributeValuesByVariantIdSchema = z.object({
  variantId: z.string().uuid("ID de variant non valide"),
});

export const findAttributeValuesByAttributeIdSchema = z.object({
  attributeId: z.string().uuid("ID d'attribut non valide"),
});
