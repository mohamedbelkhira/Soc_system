import { useCallback, useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import {
  AdvanceSaleStatus,
  embeddedUpdateAdvanceSaleSchema,
} from "@/schemas/sales/advance-sale.schema";
import { SaleCategory, SaleType } from "@/schemas/sales/sale.schema";
import { useFetchAndUpdateAdvanceSale } from "@/swr/sales/advance-sale.swr";
import { SaleItem } from "@/types/sales/sale-Item.dto";
import stockMovementItemsToSaleItems from "@/utils/adapters/stockMovementsItemToSaleItems";
import calculateTotalAmountForSaleItems from "@/utils/calculateTotalAmountForSaleItems";
import calculateTotalCostForSaleItems from "@/utils/calculateTotalCostForSaleItems";
import handleError from "@/utils/handleError";
import { showToast } from "@/utils/showToast";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export default function useUpdateAdvanceSaleForm(
  id: string,
  onSuccessCallback?: (id: string) => void
) {
  const {
    data: advanceSale,
    update,
    isLoading,
    isUpdating,
    error,
  } = useFetchAndUpdateAdvanceSale(id);
  const [removedSaleItems, setRemovedSaleItems] = useState<SaleItem[]>([]);

  const form = useForm<z.infer<typeof embeddedUpdateAdvanceSaleSchema>>({
    resolver: zodResolver(embeddedUpdateAdvanceSaleSchema),
    defaultValues: {
      id: id,
      sale: {
        type: SaleType.ADVANCE,
        category: SaleCategory.RETAIL,
        discountAmount: 0,
        saleItems: [],
      },
      status: AdvanceSaleStatus.PENDING,
    },
  });

  useEffect(() => {
    if (error) {
      showToast(
        "error",
        "Échec lors du chargement ou de mise à jour de la vente"
      );
    }
  }, [error]);

  useEffect(() => {
    if (advanceSale) {
      form.reset({
        id: id,
        sale: {
          locationId: advanceSale.sale.stockMovement.sourceLocationId,
          totalAmount: calculateTotalAmountForSaleItems(
            stockMovementItemsToSaleItems(
              advanceSale.sale.stockMovement.items
            ) || []
          ),
          discountAmount: Number(advanceSale.sale.discountAmount),
          type: advanceSale.sale.type,
          category: advanceSale.sale.category,
          saleItems:
            stockMovementItemsToSaleItems(
              advanceSale.sale.stockMovement.items
            ) || [],
        },
        clientId: advanceSale.clientId,
        paidAmount: Number(advanceSale.paidAmount),
        status: advanceSale.status,
      });
    }
  }, [advanceSale, form.reset, form, id]);

  const { append, remove } = useFieldArray({
    control: form.control,
    name: "sale.saleItems",
  });

  const handleRemoveSaleItem = useCallback(
    (index: number) => {
      setRemovedSaleItems((oldRemovedSaleItems) => {
        if (
          oldRemovedSaleItems.findIndex(
            (item) =>
              item.variantId === form.watch("sale.saleItems")[index].variantId
          ) === -1
        ) {
          return [...oldRemovedSaleItems, form.watch("sale.saleItems")[index]];
        }
        return [...oldRemovedSaleItems];
      });
      remove(index);
    },
    [form, remove]
  );

  const handleAddSaleItem = useCallback(
    (newItem: SaleItem) => {
      const existingSaleItemIndex = form
        .watch("sale.saleItems")
        .findIndex((field) => field.variantId === newItem.variantId);

      if (existingSaleItemIndex !== -1) {
        setRemovedSaleItems((oldRemovedSaleItems) => {
          if (
            oldRemovedSaleItems.findIndex(
              (item) => item.variantId === newItem.variantId
            ) === -1
          ) {
            return [
              ...oldRemovedSaleItems,
              form.watch("sale.saleItems")[existingSaleItemIndex],
            ];
          }
          return [...oldRemovedSaleItems];
        });
        remove(existingSaleItemIndex);
      }

      append(newItem);
    },
    [form, append, remove]
  );

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
  const paidAmount = Number(form.watch("paidAmount")) || 0;

  const onSubmit = async (
    values: z.infer<typeof embeddedUpdateAdvanceSaleSchema>
  ) => {
    try {
      if (!advanceSale) {
        showToast("error", "Veuillez sélectionner au moins un article");
        return;
      }
      if (values.sale.saleItems.length === 0) {
        showToast(
          "error",
          "Échec lors du chargement ou de mise à jour de la vente"
        );
        return;
      }

      if (
        values.status === AdvanceSaleStatus.COMPLETED &&
        values.paidAmount !== totalAmount - (values.sale.discountAmount ?? 0)
      ) {
        showToast(
          "error",
          "La valeur du paiement doit être égale au total de la vente pour le statut terminé"
        );
        return;
      }

      if (
        values.status === AdvanceSaleStatus.PENDING &&
        values.paidAmount === totalAmount - (values.sale.discountAmount ?? 0)
      ) {
        showToast(
          "error",
          "La valeur du paiement doit être inférieure au total de la vente pour le statut en attente"
        );
        return;
      }

      const { sale, clientId, status } = values;
      const payload = {
        id: advanceSale.id!,
        clientId,
        paidAmount: values.paidAmount,
        status:
          status !== AdvanceSaleStatus.CANCELED
            ? values.paidAmount ===
              totalAmount - (values.sale.discountAmount ?? 0)
              ? AdvanceSaleStatus.COMPLETED
              : status
            : status,
        sale: {
          id: advanceSale?.saleId,
          ...sale,
          totalAmount: calculateTotalAmountForSaleItems(values.sale.saleItems),
          discountAmount: values.sale.discountAmount,
        },
      };

      const response = await update(payload);
      showToast("success", response.message);
      onSuccessCallback?.(response.data.id);
    } catch (error) {
      console.log("Update error:", error);
      handleError(error, "Erreur lors de la mise à jour de la vente");
    }
  };

  return {
    form,
    advanceSale,
    isLoading,
    isUpdating,
    onSubmit,
    handleAddSaleItem,
    handleRemoveSaleItem,
    removedSaleItems,
    saleItems,
    totalAmount,
    totalCost,
    discountAmount,
    paidAmount,
  };
}
