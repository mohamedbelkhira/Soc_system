import { OnlineSaleStatus } from "@/schemas/sales/online-sale.schema";

export default function getOnlineSaleStatusLabel(status: OnlineSaleStatus) {
  switch (status) {
    case OnlineSaleStatus.COMPLETED:
      return "Terminé";
    case OnlineSaleStatus.PENDING:
      return "En attente";
    case OnlineSaleStatus.RETURNED:
      return "Retour";
    default:
      return "Annulé";
  }
}
