import { z } from "zod";
import { createPurchaseFullSchema, updatePurchaseFullSchema } from "../schemas/createPurchase.schema";

export type CreateFullPurchaseDTO = z.infer<typeof createPurchaseFullSchema>;
export type UpdatePurchaseFullDTO = z.infer<typeof updatePurchaseFullSchema>;


