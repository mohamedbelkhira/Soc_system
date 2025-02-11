
import { z } from 'zod';

export const createUserSchema = z.object({
  username: z.string().min(3, "Le nom d'utilisateur doit comporter au moins 3 caractères"),
  password: z.string().min(6, "Le mot de passe doit comporter au moins 6 caractères"),
  roleId: z.string().uuid("ID de rôle non valide"),
  isActive: z.boolean().optional(),
});

export const updateUserSchema = z.object({
  id: z.string().uuid("ID d'utilisateur non valide").optional(),
  username: z.string().min(3, "Le nom d'utilisateur doit comporter au moins 3 caractères").optional(),
  password: z.string().min(6, "Le mot de passe doit comporter au moins 6 caractères").optional(),
  roleId: z.string().uuid("ID de rôle non valide").optional(),
  isActive: z.boolean().optional(),
});
