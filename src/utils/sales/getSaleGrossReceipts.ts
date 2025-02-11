import { Sale } from "@/types/sales/sale.dto";

export default function getSaleGrossReceipt(sale: Sale) {
  return sale.totalAmount - (sale.discountAmount ?? 0);
}
