import { AdvanceSaleStatus } from "@/schemas/sales/advance-sale.schema";

export default function getAdvanceSaleStatusLabel(status: AdvanceSaleStatus) {
  switch (status) {
    case AdvanceSaleStatus.COMPLETED:
      return "Terminé";
    case AdvanceSaleStatus.PENDING:
      return "En attente";
    case AdvanceSaleStatus.CANCELED:
      return "Annulé";
    default:
      return "Annulé";
  }
}
