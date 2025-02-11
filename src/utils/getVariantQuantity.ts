import { Variant } from "@/types/variant.dto";

export default function getVariantQuantity(variant: Variant) {
  return variant.currentStock.reduce((sum, stock) => sum + stock.quantity, 0);
}
