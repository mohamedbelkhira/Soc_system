import { AdvanceSaleStatus } from "@/schemas/sales/advance-sale.schema";
import { Check, Loader, X } from "lucide-react";

export default function getAdvanceSaleStatusIcon(status: AdvanceSaleStatus) {
  switch (status) {
    case AdvanceSaleStatus.COMPLETED:
      return Check;
    case AdvanceSaleStatus.PENDING:
      return Loader;
    case AdvanceSaleStatus.CANCELED:
      return X;
    default:
      return X;
  }
}
