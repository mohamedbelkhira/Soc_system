import { useCallback, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { SaleCategory, SaleType } from "@/schemas/sales/sale.schema";
import {
  StoreSaleStatus,
  embeddedCreateStoreSaleSchema,
} from "@/schemas/sales/store-sale.schema";
import { useCreateStoreSale } from "@/swr/sales/store-sale.swr";
import { SaleItem } from "@/types/sales/sale-Item.dto";
import { EmbeddedCreateStoreSaleDTO } from "@/types/sales/store-sale.dto";
import calculateTotalAmountForSaleItems from "@/utils/calculateTotalAmountForSaleItems";
import calculateTotalCostForSaleItems from "@/utils/calculateTotalCostForSaleItems";
import handleError from "@/utils/handleError";
import { showToast } from "@/utils/showToast";
import { zodResolver } from "@hookform/resolvers/zod";

export default function useCreateStoreSaleForm(onSuccessCallback?: () => void) {
  const { create, isCreating, error } = useCreateStoreSale();

  const form = useForm<EmbeddedCreateStoreSaleDTO>({
    resolver: zodResolver(embeddedCreateStoreSaleSchema),
    defaultValues: {
      sale: {
        type: SaleType.STORE,
        category: SaleCategory.RETAIL,
        totalAmount: 0,
        discountAmount: 0,
        saleItems: [],
      },
      clientId: "",
      status: StoreSaleStatus.COMPLETED,
      completedAt: new Date().toISOString(),
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

  const onSubmit = async (values: EmbeddedCreateStoreSaleDTO) => {
    try {
      if (values.sale.saleItems.length === 0) {
        showToast("error", "Veuillez sélectionner au moins un article");
        return;
      }

      const { sale, ...storeSaleData } = values;

      console.log({ storeSaleData });

      const payload = {
        ...storeSaleData,
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
    remove,
    error,
  };
}
