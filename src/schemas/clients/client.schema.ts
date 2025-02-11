import { z } from "zod";

export interface SchemaOptions {
  isPhoneRequired?: boolean;
  isAddressRequired?: boolean;
}

export const createClientSchema = (options: SchemaOptions = {}) => {
  const { isPhoneRequired = true, isAddressRequired = false } = options;

  return z.object({
    firstName: z.string().min(1, "Le prénom est requis"),
    lastName: z.string().min(1, "Le nom est requis"),
    phoneNumber: isPhoneRequired
      ? z.string().min(1, "Le numéro de téléphone est requis")
      : z.string().nullable().optional(),
    email: z.string().email("Format d'email non valide").nullable().optional(),
    address: isAddressRequired
      ? z.string().min(1, "L'adresse est requise")
      : z.string().nullable().optional(),
  });
};

export const updateClientSchema = z.object({
  id: z.string().uuid("ID de client non valide"),
  firstName: z.string().min(1, "Le prénom est requis").optional(),
  lastName: z.string().min(1, "Le nom est requis").optional(),
  phoneNumber: z.string(),
  email: z.string().email("Format d'email non valide").nullable().optional(),
  address: z.string().nullable().optional(),
});

export const deleteClientSchema = z.object({
  id: z.string().uuid("ID de client non valide"),
});

export const findClientByIdSchema = z.object({
  id: z.string().uuid("ID de client non valide"),
});

export const findClientByPhoneSchema = z.object({
  phoneNumber: z.string().min(1, "Le numéro de téléphone est requis"),
});
