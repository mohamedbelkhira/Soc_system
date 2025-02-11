import { Variant } from "@/types/variant.dto";

export default function calculateVariantStock(
  locationId: string,
  variant: Variant
) {
  return variant.currentStock
    .filter((stock) => stock.locationId === locationId)
    .reduce((sum, stock) => sum + stock.quantity, 0);
}
