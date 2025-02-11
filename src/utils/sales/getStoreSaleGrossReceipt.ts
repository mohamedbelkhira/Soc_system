import { StoreSaleStatus } from "@/schemas/sales/store-sale.schema";
import { StoreSale } from "@/types/sales/store-sale.dto";

import getSaleGrossReceipt from "./getSaleGrossReceipts";

export default function getStoreSaleGrossReceipt(storeSale: StoreSale) {
  return storeSale.status === StoreSaleStatus.COMPLETED
    ? getSaleGrossReceipt(storeSale.sale)
    : 0;
}
