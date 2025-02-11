import { StoreSaleStatus } from "@/schemas/sales/store-sale.schema";
import { Check, X } from "lucide-react";

export default function getStoreSaleStatusIcon(status: StoreSaleStatus) {
  switch (status) {
    case StoreSaleStatus.COMPLETED:
      return Check;
    case StoreSaleStatus.CANCELED:
      return X;
    default:
      return X;
  }
}
