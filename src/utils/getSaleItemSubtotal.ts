import { SaleItem } from "@/types/sales/sale-Item.dto";

import getSaleItemQuantity from "./getSaleItemTotalQuantity";

export default function getSaleItemSubtotal(saleItem: SaleItem) {
  return getSaleItemQuantity(saleItem) * saleItem.price;
}
