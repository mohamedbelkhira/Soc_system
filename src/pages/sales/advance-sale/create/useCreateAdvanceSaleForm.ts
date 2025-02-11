import { useCallback, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import {
  AdvanceSaleStatus,
  embeddedCreateAdvanceSaleSchema,
} from "@/schemas/sales/advance-sale.schema";
import { SaleCategory, SaleType } from "@/schemas/sales/sale.schema";
import { useCreateAdvanceSale } from "@/swr/sales/advance-sale.swr";
import { EmbeddedCreateAdvanceSaleDTO } from "@/types/sales/advance-sale.dto";
import { SaleItem } from "@/types/sales/sale-Item.dto";
import calculateTotalAmountForSaleItems from "@/utils/calculateTotalAmountForSaleItems";
import calculateTotalCostForSaleItems from "@/utils/calculateTotalCostForSaleItems";
import handleError from "@/utils/handleError";
import { showToast } from "@/utils/showToast";
import { zodResolver } from "@hookform/resolvers/zod";

export default function useCreateAdvanceSaleForm(
  onSuccessCallback?: () => void
) {
  const { create, isCreating } = useCreateAdvanceSale();

  const form = useForm<EmbeddedCreateAdvanceSaleDTO>({
    resolver: zodResolver(embeddedCreateAdvanceSaleSchema),
    defaultValues: {
      sale: {
        type: SaleType.ADVANCE,
        category: SaleCategory.RETAIL,
        totalAmount: 0,
        discountAmount: 0,
        saleItems: [],
      },
      clientId: "",
      paidAmount: 0,
      status: AdvanceSaleStatus.PENDING,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "sale.saleItems",
  });

  const saleItems = form.watch("sale.saleItems");

  const totalAmount = useMemo(
    () => calculateTotalAmountForSaleItems(saleItems),
    [saleItems]
  );
  const discountAmount = Number(form.watch("sale.discountAmount")) || 0;
  const paidAmount = Number(form.watch("paidAmount")) || 0;
  const totalCost = useMemo(
    () => calculateTotalCostForSaleItems(saleItems),
    [saleItems]
  );

  const handleSaleItemsAdd = useCallback(
    (newItem: SaleItem) => {
      const existingSaleItemIndex = fields.findIndex(
        (field) => field.variantId === newItem.variantId
      );

      if (existingSaleItemIndex !== -1) {
        remove(existingSaleItemIndex);
      }

      append(newItem);
    },
    [fields, append, remove]
  );

  const onSubmit = async (values: EmbeddedCreateAdvanceSaleDTO) => {
    try {
      if (values.sale.saleItems.length === 0) {
        showToast("error", "Veuillez sélectionner au moins un article");
        return;
      }

      const { sale, clientId, paidAmount, status } = values;
      const payload = {
        clientId,
        status:
          values.paidAmount === totalAmount - (values.sale.discountAmount || 0)
            ? AdvanceSaleStatus.COMPLETED
            : status,
        paidAmount,
        sale: {
          ...sale,
          totalAmount,
        },
      };

      const response = await create(payload);

      showToast("success", response.message);
      onSuccessCallback?.();
    } catch (error) {
      handleError(error, "Erreur lors de la création de la vente");
    }
  };

  return {
    form,
    isSubmitting: isCreating,
    onSubmit,
    handleSaleItemsAdd,
    saleItems,
    totalAmount,
    totalCost,
    discountAmount,
    paidAmount,
    remove,
  };
}
