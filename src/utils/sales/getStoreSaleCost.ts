import { StoreSaleStatus } from "@/schemas/sales/store-sale.schema";
import { StoreSale } from "@/types/sales/store-sale.dto";

import getSaleCost from "./getSaleCost";

export default function getStoreSaleCost(storeSale: StoreSale) {
  return storeSale.status === StoreSaleStatus.COMPLETED
    ? getSaleCost(storeSale.sale)
    : 0;
}
