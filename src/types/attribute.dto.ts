import {
  AttributeType,
  createAttributeSchema,
  updateAttributeSchema,
} from "../schemas/attribute.schema";
import z from "zod";

export interface Attribute {
  id: string;
  name: string;
  type: AttributeType;
  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

export type CreateAttributeDTO = z.infer<typeof createAttributeSchema>;
export type UpdateAttributeDTO = z.infer<typeof updateAttributeSchema>;
