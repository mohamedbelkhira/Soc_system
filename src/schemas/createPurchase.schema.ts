import { z } from "zod";
import { createPurchaseSchema, updatePurchaseSchema } from "./purchase.schema";
import { createPurchaseItemSchema, updatePurchaseItemSchema } from "./purchaseItem.schema";
import { createAppliedPurchaseFeeSchema, updateAppliedPurchaseFeeSchema } from "./appliedPurchaseFee.schema";

export const createPurchaseFullSchema = createPurchaseSchema.extend({
  locationId:z.string().nullable(),
  purchaseItems: z.array(createPurchaseItemSchema).min(1, "au moin un article doit étre acheté"),
  appliedFees: z.array(createAppliedPurchaseFeeSchema.omit({ purchaseId: true })).optional().default([]),
});

export const updatePurchaseFullSchema = updatePurchaseSchema.extend({
  locationId:z.string().nullable(),
  purchaseItems: z.array(updatePurchaseItemSchema).min(1, "au moin un article doit étre acheté"),
  appliedFees: z.array(updateAppliedPurchaseFeeSchema).optional().default([]),
});