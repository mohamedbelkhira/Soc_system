import { AdvanceSaleStatus } from "@/schemas/sales/advance-sale.schema";
import { AdvanceSale } from "@/types/sales/advance-sale.dto";

import getSaleCost from "./getSaleCost";

export default function getAdvanceSaleCost(advanceSale: AdvanceSale) {
  return advanceSale.status === AdvanceSaleStatus.CANCELED
    ? 0
    : getSaleCost(advanceSale.sale);
}
