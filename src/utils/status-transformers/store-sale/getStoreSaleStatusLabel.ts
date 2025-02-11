import { StoreSaleStatus } from "@/schemas/sales/store-sale.schema";

export default function getStoreSaleStatusLabel(status: StoreSaleStatus) {
  switch (status) {
    case StoreSaleStatus.COMPLETED:
      return "Terminée";
    case StoreSaleStatus.CANCELED:
      return "Annulée";
    default:
      return "Annulée";
  }
}
