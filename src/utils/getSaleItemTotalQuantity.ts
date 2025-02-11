import { SaleItem } from "@/types/sales/sale-Item.dto";

export default function getSaleItemQuantity(saleItem: SaleItem) {
  return saleItem.details.reduce(
    (subtotal, detail) => subtotal + detail.quantity,
    0
  );
}
