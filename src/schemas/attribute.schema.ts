import capitalizeFirstCharacter from "@/utils/formatters/capitalizeFirstCharacter";
import z from "zod";

export enum AttributeType {
  STRING = "STRING",
  NUMBER = "NUMBER",
}
export const createAttributeSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom de l'attribut est requis")
    .trim()
    .transform(capitalizeFirstCharacter),
  type: z.nativeEnum(AttributeType),
  isActive: z.boolean().default(true),
});

export const updateAttributeSchema = z.object({
  id: z.string().uuid("ID d'attribut non valide"),
  name: z
    .string()
    .min(1, "Le nom de l'attribut est requis")
    .trim()
    .transform(capitalizeFirstCharacter),
  type: z.nativeEnum(AttributeType),
  isActive: z.boolean(),
});
