import { ColorScheme } from "@/components/common/InformationCard";
import { AdvanceSaleStatus } from "@/schemas/sales/advance-sale.schema";

export default function getAdvanceSaleStatusScheme(
  status: AdvanceSaleStatus
): ColorScheme {
  switch (status) {
    case AdvanceSaleStatus.COMPLETED:
      return "success";
    case AdvanceSaleStatus.PENDING:
      return "warning";
    case AdvanceSaleStatus.CANCELED:
      return "danger";
    default:
      return "danger";
  }
}
