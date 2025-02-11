
import { z } from 'zod';
import { Permission } from '@/types/permission.enum';

export const createRoleSchema = z.object({
  name: z.string().min(3, 'Le nom du rôle doit comporter au moins 3 caractères'),
  description: z.string().optional(),
  permissions: z.array(z.nativeEnum(Permission)).optional(),
});

export const updateRoleSchema = z.object({
  id: z.string().uuid('ID de rôle non valide'),
  name: z.string().min(3, 'Le nom du rôle doit comporter au moins 3 caractères').optional(),
  description: z.string().optional(),
  permissions: z.array(z.nativeEnum(Permission)).optional(),
});

export const deleteRoleSchema = z.object({
  id: z.string().uuid('ID de rôle non valide'),
});