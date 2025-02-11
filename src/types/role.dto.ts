import { z } from 'zod';
import { createRoleSchema, updateRoleSchema, deleteRoleSchema } from '@/schemas/role.schema';
import { Permission } from '@/types/permission.enum';

export type CreateRoleDTO = z.infer<typeof createRoleSchema>;
export type UpdateRoleDTO = z.infer<typeof updateRoleSchema>;
export type DeleteRoleDTO = z.infer<typeof deleteRoleSchema>;

export interface RoleResponse {
  id: string;
  name: string;
  description?: string | null;
  permissions: Permission[];
  createdAt: string; // Use string if dates are serialized as strings in your API
  updatedAt: string;
}