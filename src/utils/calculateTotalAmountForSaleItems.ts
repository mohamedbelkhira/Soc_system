import { SaleItem } from "@/types/sales/sale-Item.dto";

export default function calculateTotalAmountForSaleItems(
  saleItems: SaleItem[]
): number {
  if (!Array.isArray(saleItems)) {
    return 0;
  }
  return saleItems.reduce((total, item) => {
    const itemTotal = item.details.reduce(
      (subtotal, detail) => subtotal + item.price * detail.quantity,
      0
    );
    return total + itemTotal;
  }, 0);
}
