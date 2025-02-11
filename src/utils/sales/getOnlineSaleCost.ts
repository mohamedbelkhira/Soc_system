import { OnlineSaleStatus } from "@/schemas/sales/online-sale.schema";
import { OnlineSale } from "@/types/sales/online-sale.dto";

import getSaleCost from "./getSaleCost";

export default function getOnlineSaleCost(onlineSale: OnlineSale) {
  switch (onlineSale.status) {
    case OnlineSaleStatus.COMPLETED:
      return getSaleCost(onlineSale.sale);
    case OnlineSaleStatus.RETURNED:
      return  onlineSale.returnCost;
    default:
      return 0;
  }
}
