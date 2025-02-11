import { StoreSaleStatus } from "@/schemas/sales/store-sale.schema";

export default function getStoreSaleStatusIcon(status: StoreSaleStatus) {
  switch (status) {
    case StoreSaleStatus.COMPLETED:
      return "Terminé";
    case StoreSaleStatus.CANCELED:
      return "Annulé";
    default:
      return "Annulé";
  }
}
