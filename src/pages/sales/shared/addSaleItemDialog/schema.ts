import { z } from "zod";

export const addSaleItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  variantId: z.string().min(1, "Variant is required"),
  quantity: z.number().min(1, "Quantity must be greater than 0"),
});

export type AddSaleItemFormValues = z.infer<typeof addSaleItemSchema>;

export const DEFAULT_FORM_VALUES: AddSaleItemFormValues = {
  productId: "",
  variantId: "",
  quantity: 0,
};
