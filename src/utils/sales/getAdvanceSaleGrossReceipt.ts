import { AdvanceSaleStatus } from "@/schemas/sales/advance-sale.schema";
import { AdvanceSale } from "@/types/sales/advance-sale.dto";

export default function getAdvanceSaleGrossReceipt(advanceSale: AdvanceSale) {
  return advanceSale.status === AdvanceSaleStatus.CANCELED
    ? 0
    : advanceSale.paidAmount - (advanceSale.sale.discountAmount ?? 0);
}
