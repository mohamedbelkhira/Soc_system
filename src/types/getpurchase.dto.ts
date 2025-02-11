// src/types/purchase.dto.ts
// import { Variant } from "./variant.dto";
import { AppliedPurchaseFee } from "./appliedPurchaseFee.dto";
import { PurchaseItem } from "./purchaseItem.dto";
import { Supplier } from "./supplier.dto";

export interface Purchase_with_extra_data {
  id: string;
  supplierId: string;
  description: string;
  state: string;
  orderedAt: string | null;
  receivedAt: string | null;
  canceledAt: string | null;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  supplier: Supplier;
  purchaseItems: PurchaseItem[];
  appliedFees: AppliedPurchaseFee[];
}

// export interface Supplier {
//   id: string;
//   name: string;
//   // other supplier fields
// }

// export interface PurchaseItem {
//   id: string;
//   purchaseId: string;
//   variantId: string;
//   quantity: number;
//   unitCost: string;
//   variant: Variant;
// }

// export interface AppliedPurchaseFee {
//   id: string;
//   amount: string;
//   purchaseFeeId: string;
//   purchaseFee: {
//     id: string;
//     name: string;
//   };
// }
