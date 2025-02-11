import {
  createAttributeValueSchema,
  deleteAttributeValueSchema,
  findAttributeValueByIdSchema,
  updateAttributeValueSchema,
  findAttributeValuesByVariantIdSchema,
  findAttributeValuesByAttributeIdSchema,
} from "../schemas/attributeValue.schema";
import z from "zod";
import { Variant } from "./variant.dto";
import { Attribute } from "./attribute.dto";

export interface AttributeValue {
  id: string;
  variantId: string;
  attributeId: string;
  value: string;

  variant: Variant;
  attribute: Attribute;
  createdAt: string;
  updatedAt: string;
}

export type CreateAttributeValueDTO = z.infer<
  typeof createAttributeValueSchema
>;
export type UpdateAttributeValueDTO = z.infer<
  typeof updateAttributeValueSchema
>;
export type DeleteAttributeValueDTO = z.infer<
  typeof deleteAttributeValueSchema
>;
export type FindAttributeValueByIdDTO = z.infer<
  typeof findAttributeValueByIdSchema
>;
export type FindAttributeValuesByVariantIdDTO = z.infer<
  typeof findAttributeValuesByVariantIdSchema
>;
export type FindAttributeValuesByAttributeIdDTO = z.infer<
  typeof findAttributeValuesByAttributeIdSchema
>;

export interface AttributeValuePair {
  attributeId: string;
  value: string;
}

export interface VariantFormValues {
  attributeValues: Record<string, string[]>;
}
