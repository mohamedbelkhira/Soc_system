import { OnlineSaleStatus } from "@/schemas/sales/online-sale.schema";
import { Check, Loader, Undo2, X } from "lucide-react";

export default function getOnlineSaleStatusIcon(status: OnlineSaleStatus) {
  switch (status) {
    case OnlineSaleStatus.COMPLETED:
      return Check;
    case OnlineSaleStatus.PENDING:
      return Loader;
    case OnlineSaleStatus.RETURNED:
      return Undo2;
    default:
      return X;
  }
}
