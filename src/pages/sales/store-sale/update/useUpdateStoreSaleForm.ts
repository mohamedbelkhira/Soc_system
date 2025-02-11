import { useCallback, useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { SaleCategory, SaleType } from "@/schemas/sales/sale.schema";
import {
  StoreSaleStatus,
  embeddedUpdateStoreSaleSchema,
} from "@/schemas/sales/store-sale.schema";
import { useFetchAndUpdateStoreSale } from "@/swr/sales/store-sale.swr";
import { SaleItem } from "@/types/sales/sale-Item.dto";
import { EmbeddedUpdateStoreSaleDTO } from "@/types/sales/store-sale.dto";
import stockMovementItemsToSaleItems from "@/utils/adapters/stockMovementsItemToSaleItems";
import calculateTotalAmountForSaleItems from "@/utils/calculateTotalAmountForSaleItems";
import calculateTotalCostForSaleItems from "@/utils/calculateTotalCostForSaleItems";
import handleError from "@/utils/handleError";
import { showToast } from "@/utils/showToast";
import { zodResolver } from "@hookform/resolvers/zod";

export default function useUpdateStoreSaleForm(
  id: string,
  onSuccessCallback?: () => void
) {
  const {
    data: storeSale,
    update,
    isLoading,
    isUpdating,
    error,
  } = useFetchAndUpdateStoreSale(id);
  const [removedSaleItems, setRemovedSaleItems] = useState<SaleItem[]>([]);

  const form = useForm<EmbeddedUpdateStoreSaleDTO>({
    resolver: zodResolver(embeddedUpdateStoreSaleSchema),
    defaultValues: {
      sale: {
        type: SaleType.STORE,
        category: SaleCategory.RETAIL,
        employeeId: "",
        discountAmount: 0,
        saleItems: [],
      },
      clientId: "",
      status: StoreSaleStatus.COMPLETED,
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
    if (storeSale) {
      console.log({ storeSale });

      form.reset({
        id: storeSale.id,
        status: storeSale.status,
        sale: {
          locationId: storeSale.sale.stockMovement.sourceLocationId,
          discountAmount: Number(storeSale.sale.discountAmount),
          category: storeSale.sale.category,
          employeeId: storeSale.sale.employeeId,
          saleItems:
            stockMovementItemsToSaleItems(storeSale.sale.stockMovement.items) ||
            [],
          totalAmount: Number(storeSale.sale.totalAmount),
          type: storeSale.sale.type,
        },
        clientId: storeSale.clientId,
        completedAt: storeSale.completedAt
          ? storeSale.completedAt.toString()
          : undefined,
        canceledAt: storeSale.canceledAt
          ? storeSale.canceledAt.toString()
          : undefined,
      });
    }
  }, [storeSale, form]);

  const { append, remove } = useFieldArray({
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
        } else {
          return [...oldRemovedSaleItems];
        }
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
          } else {
            return [...oldRemovedSaleItems];
          }
        });
        remove(existingSaleItemIndex);
      }

      append(newItem);
    },
    [form, append, remove]
  );

  const onSubmit = async (values: EmbeddedUpdateStoreSaleDTO) => {
    try {
      if (!storeSale) {
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

      const { sale, completedAt, canceledAt, ...storeSaleData } = values;

      const payload: EmbeddedUpdateStoreSaleDTO = {
        id: storeSale.id,
        clientId: storeSaleData.clientId,
        status: storeSaleData.status,
        sale: {
          ...sale,
          totalAmount: calculateTotalAmountForSaleItems(values.sale.saleItems),
          discountAmount: values.sale.discountAmount,
        },
      };

      if (storeSaleData.status === StoreSaleStatus.COMPLETED) {
        payload.completedAt = completedAt;
        payload.canceledAt = storeSale.canceledAt?.toString();
      } else if (storeSaleData.status === StoreSaleStatus.CANCELED) {
        payload.canceledAt = canceledAt;
        payload.completedAt = storeSale.completedAt?.toString();
      }
      const response = await update(payload);

      showToast("success", response.message);
      onSuccessCallback?.();
    } catch (error) {
      console.log("Update error:", error);
      handleError(error, "Erreur lors de la mise à jour de la vente");
    }
  };

  return {
    form,
    storeSale,
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
  };
}
