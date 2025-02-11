import { env } from "@/config/environment";
import { SaleItem } from "@/types/sales/sale-Item.dto";
import { PopulatedStockMovementItem } from "@/types/stock-management/stock-movement-item.dto";

import getVariantName from "../getVariantName";

export default function stockMovementItemsToSaleItems(
  items: PopulatedStockMovementItem[]
): SaleItem[] {
  const saleItemMap = new Map<string, SaleItem>();

  for (const item of items) {
    if (!saleItemMap.has(item.variantId)) {
      saleItemMap.set(item.variantId, {
        productId: item.variant.productId,
        variantId: item.variantId,
        productName: item.variant.product.name,
        variantName: item.variant.product.hasVariants
          ? getVariantName(item.variant)
          : "-",
        price: Number(item.price) || 0,
        weight: Number(item.variant.product.weight) || 0,
        details: [],
      });
    }

    const saleItem = saleItemMap.get(item.variantId)!;
    saleItem.details.push({
      purchaseItemId: item.purchaseItemId,
      quantity: Number(item.quantity) || 0,
      unitCost: Number(item.purchaseItem.unitCost) || 0,
      costPerKg: Number(
        item.purchaseItem.purchase.costPerKg ?? env.COST_PER_KG
      ),
    });
  }

  return Array.from(saleItemMap.values());
}
