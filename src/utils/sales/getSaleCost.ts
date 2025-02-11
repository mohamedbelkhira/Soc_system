import { Sale } from "@/types/sales/sale.dto";

import stockMovementItemsToSaleItems from "../adapters/stockMovementsItemToSaleItems";

export default function getSaleCost(sale: Sale) {
  const saleItems = stockMovementItemsToSaleItems(sale.stockMovement.items);
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
