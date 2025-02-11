import { z } from 'zod';
import { createUserSchema, updateUserSchema } from './user.schema'
export const createEmployeeSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit comporter au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit comporter au moins 2 caractères"),
  phoneNumber: z.string().regex(/^0\d{9}$/, "Format de numéro de téléphone invalide"),
  jobId: z.string().uuid("ID de poste non valide"),
  isActive: z.boolean().optional(),
  // Include user data if creating an account
  user: createUserSchema.optional(),
});

export const updateEmployeeSchema = z.object({
  id: z.string().uuid("ID d'employé non valide"),
  firstName: z.string().min(2, "Le prénom doit comporter au moins 2 caractères").optional(),
  lastName: z.string().min(2, "Le nom doit comporter au moins 2 caractères").optional(),
  phoneNumber: z.string().regex(/^0\d{9}$/, "Format de numéro de téléphone invalide").optional(),
  jobId: z.string().uuid("ID de poste non valide").optional(),
  isActive: z.boolean().optional(),
  // Include user data if updating an account
  user: updateUserSchema.optional(),
});

export const deleteEmployeeSchema = z.object({
  id: z.string().uuid("ID d'employé non valide"),
});