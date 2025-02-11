import { SaleItem } from "@/types/sales/sale-Item.dto";

export default function calculateTotalCostForSaleItems(
  saleItems: SaleItem[]
): number {
  if (!Array.isArray(saleItems)) {
    return 0;
  }
  return saleItems.reduce((total, item) => {
    const itemTotal = item.details.reduce(
      (subtotal, detail) =>
        subtotal +
        (detail.unitCost + item.weight * (detail.costPerKg / 1000)) *
          detail.quantity,
      0
    );
    return total + itemTotal;
  }, 0);
}
