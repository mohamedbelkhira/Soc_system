import { ColorScheme } from "@/components/common/InformationCard";
import { OnlineSaleStatus } from "@/schemas/sales/online-sale.schema";

export default function getOnlineSaleStatusScheme(
  status: OnlineSaleStatus
): ColorScheme {
  switch (status) {
    case OnlineSaleStatus.COMPLETED:
      return "success";
    case OnlineSaleStatus.PENDING:
      return "warning";
    default:
      return "danger";
  }
}
