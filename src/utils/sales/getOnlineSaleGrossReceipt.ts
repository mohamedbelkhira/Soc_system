import { OnlineSaleStatus } from "@/schemas/sales/online-sale.schema";
import { OnlineSale } from "@/types/sales/online-sale.dto";

import getSaleGrossReceipt from "./getSaleGrossReceipts";

export default function getOnlineSaleGrossReceipt(onlineSale: OnlineSale) {
  switch (onlineSale.status) {
    case OnlineSaleStatus.COMPLETED:
      return getSaleGrossReceipt(onlineSale.sale);

    default:
      return 0;
  }
}
