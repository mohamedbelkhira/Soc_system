import { ColorScheme } from "@/components/common/InformationCard";
import { StoreSaleStatus } from "@/schemas/sales/store-sale.schema";

export default function getStoreSaleStatusScheme(
  status: StoreSaleStatus
): ColorScheme {
  switch (status) {
    case StoreSaleStatus.COMPLETED:
      return "success";
    case StoreSaleStatus.CANCELED:
      return "danger";
    default:
      return "danger";
  }
}
