import { saleItemSchema } from "@/schemas/sales/sale-item.schema";
import { SaleCategory, SaleType } from "@/schemas/sales/sale.schema";
import { StoreSaleStatus } from "@/schemas/sales/store-sale.schema";
import { z } from "zod";

const formSchema = z.object({
  sale: z.object({
    locationId: z.string().uuid("ID de localisation non valide").nullable(),
    type: z.nativeEnum(SaleType).optional().default(SaleType.STORE),
    category: z
      .nativeEnum(SaleCategory)
      .optional()
      .default(SaleCategory.RETAIL),
    employeeId: z.string().uuid("ID d'employé non valide"),
    discountAmount: z
      .number()
      .nonnegative("Le montant de remise doit être positif")
      .nullable(),
    saleItems: z.array(saleItemSchema),
  }),
  clientId: z
    .string()
    .transform((val) => (val === "" ? null : val))
    .nullable(),
  status: z.nativeEnum(StoreSaleStatus).default(StoreSaleStatus.COMPLETED),
  completedAt: z.coerce.date().optional(),
  canceledAt: z.coerce.date().optional(),
});

export default formSchema;
