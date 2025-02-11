import { SaleItem } from "@/types/sales/sale-Item.dto";

export default function saleItemsToStockMovementItems(saleItems: SaleItem[]) {
  return saleItems.flatMap((item) => {
    return item.details.map((detail) => ({
      variantId: item.variantId,
      purchaseItemId: detail.purchaseItemId,
      quantity: detail.quantity,
      price: item.price,
    }));
  });
}
