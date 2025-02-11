import { env } from "@/config/environment";
import { Product } from "@/types/product.dto";
import { SaleItem } from "@/types/sales/sale-Item.dto";
import { CurrentStock } from "@/types/stock-management/current-stock.dto";
import { Variant } from "@/types/variant.dto";

export interface StockCalculationResult {
  availableStock: number;
  stockDetails: SaleItem["details"];
}

export const findProductById = (
  products: Product[],
  productId: string
): Product | undefined => products.find((product) => product.id === productId);

export const findVariantById = (
  variants: Variant[],
  variantId: string
): Variant | undefined => variants.find((variant) => variant.id === variantId);

export const calculateAvailableStock = (
  stocks: CurrentStock[],
  locationId: string
): number =>
  stocks
    .filter((stock) => stock.locationId === locationId && stock.quantity > 0)
    .reduce((sum, stock) => sum + stock.quantity, 0);

export const calculateStockItems = (
  stocks: CurrentStock[],
  locationId: string,
  requestedQuantity: number
): StockCalculationResult => {
  // Sort stocks by creation date (oldest first)
  const availableStocks = stocks
    .filter((stock) => stock.locationId === locationId && stock.quantity > 0)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  const totalAvailableStock = calculateAvailableStock(
    availableStocks,
    locationId
  );

  if (totalAvailableStock < requestedQuantity) {
    throw new Error("Insufficient stock to fulfill the requested quantity");
  }

  let remainingQuantity = requestedQuantity;
  const stockDetails: SaleItem["details"] = [];

  for (const stock of availableStocks) {
    if (remainingQuantity <= 0) break;

    const quantityFromThisStock = Math.min(stock.quantity, remainingQuantity);

    stockDetails.push({
      purchaseItemId: stock.purchaseItemId,
      quantity: quantityFromThisStock,
      unitCost: Number(stock.purchaseItem.unitCost),
      costPerKg: Number(
        stock.purchaseItem.purchase.costPerKg ?? env.COST_PER_KG
      ),
    });

    remainingQuantity -= quantityFromThisStock;
  }

  return {
    availableStock: totalAvailableStock,
    stockDetails,
  };
};

export const adjustStockWithRemovedItems = (
  currentStocks: CurrentStock[],
  removedSaleItems: SaleItem[],
  locationId: string
): CurrentStock[] => {
  const modifiableStocks = JSON.parse(
    JSON.stringify(currentStocks)
  ) as CurrentStock[];

  removedSaleItems.forEach((removedItem) => {
    removedItem.details.forEach((detail) => {
      const stockEntry = modifiableStocks.find(
        (stock) =>
          stock.locationId === locationId &&
          stock.purchaseItemId === detail.purchaseItemId
      );

      if (stockEntry) {
        stockEntry.quantity += detail.quantity;
      }
    });
  });

  return modifiableStocks;
};
