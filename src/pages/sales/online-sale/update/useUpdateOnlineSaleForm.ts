import { useCallback, useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import {
  OnlineSaleStatus,
  embeddedUpdateOnlineSaleSchema,
} from "@/schemas/sales/online-sale.schema";
import { SaleCategory, SaleType } from "@/schemas/sales/sale.schema";
import { useUpdateOnlineSale } from "@/swr/sales/online-sale.swr";
import { DeliveryHandler } from "@/types/deliveryHandler.dto";
import { EmbeddedUpdateOnlineSaleDTO } from "@/types/sales/online-sale.dto";
import { SaleItem } from "@/types/sales/sale-Item.dto";
import stockMovementItemsToSaleItems from "@/utils/adapters/stockMovementsItemToSaleItems";
import calculateTotalAmountForSaleItems from "@/utils/calculateTotalAmountForSaleItems";
import calculateTotalCostForSaleItems from "@/utils/calculateTotalCostForSaleItems";
import handleError from "@/utils/handleError";
import { showToast } from "@/utils/showToast";
import { zodResolver } from "@hookform/resolvers/zod";

export default function useUpdateOnlineSaleForm(
  id: string,
  deliveryHandlers: DeliveryHandler[],
  onSuccessCallback?: () => void
) {
  const {
    data: onlineSale,
    update,
    isUpdating,
    isLoading,
  } = useUpdateOnlineSale(id);
  const [removedSaleItems, setRemovedSaleItems] = useState<SaleItem[]>([]);
  const [lastSelectedHandler, setLastSelectedHandler] = useState<string | null>(
    null
  );
  const form = useForm<EmbeddedUpdateOnlineSaleDTO>({
    resolver: zodResolver(embeddedUpdateOnlineSaleSchema),
    defaultValues: {
      sale: {
        type: SaleType.ONLINE,
        category: SaleCategory.RETAIL,
        totalAmount: 0,
        discountAmount: 0,
        saleItems: [],
      },
      clientId: "",
      trackingNumber: "",
      status: OnlineSaleStatus.PENDING,
    },
  });

  useEffect(() => {
    if (onlineSale) {
      const { sale, ...onlineSaleData } = onlineSale;

      form.reset({
        sale: {
          ...sale,
          discountAmount: Number(sale.discountAmount),
          saleItems: stockMovementItemsToSaleItems(sale.stockMovement.items),
        },
        ...onlineSaleData,

        deliveryCost: Number(onlineSale.deliveryCost),
        returnCost: Number(onlineSale.returnCost),
        completedAt: onlineSale.completedAt
          ? onlineSale.completedAt.toString()
          : undefined,
        returnedAt: onlineSale.returnedAt
          ? onlineSale.returnedAt.toString()
          : undefined,
        canceledAt: onlineSale.canceledAt
          ? onlineSale.canceledAt.toString()
          : undefined,
      });
    }
  }, [form, onlineSale]);

  const { append, remove } = useFieldArray({
    control: form.control,
    name: "sale.saleItems",
  });

  const saleItems = form.watch("sale.saleItems");

  useEffect(() => {
    if (
      form.watch("status") === OnlineSaleStatus.COMPLETED &&
      !onlineSale?.completedAt
    ) {
      form.setValue("completedAt", new Date().toISOString());
    }
  }, [form.watch("status")]);

  useEffect(() => {
    if (
      form.watch("status") === OnlineSaleStatus.RETURNED &&
      !onlineSale?.returnedAt
    ) {
      form.setValue("returnedAt", new Date().toISOString());
    }
  }, [form.watch("status")]);

  useEffect(() => {
    if (
      form.watch("status") === OnlineSaleStatus.CANCELED &&
      !onlineSale?.canceledAt
    ) {
      form.setValue("canceledAt", new Date().toISOString());
    }
  }, [form.watch("status")]);

  useEffect(() => {
    form.setValue(
      "sale.totalAmount",
      calculateTotalAmountForSaleItems(saleItems)
    );
  }, [form, saleItems]);

  useEffect(() => {
    if (!onlineSale) return;

    const deliveryHandlerId = form.watch("deliveryHandlerId");

    if (!deliveryHandlerId) return;

    if (lastSelectedHandler === null) {
      setLastSelectedHandler(deliveryHandlerId);
      return;
    }

    if (deliveryHandlerId !== lastSelectedHandler) {
      const selectedHandler = deliveryHandlers.find(
        (handler) => handler.id === deliveryHandlerId
      );

      if (selectedHandler) {
        form.setValue("deliveryCost", Number(selectedHandler.deliveryCost));
        form.setValue("returnCost", Number(selectedHandler.returnCost));
      }

      setLastSelectedHandler(deliveryHandlerId);
    }
  }, [form.watch("deliveryHandlerId"), deliveryHandlers, onlineSale]);
  const totalAmount = useMemo(
    () => calculateTotalAmountForSaleItems(saleItems),
    [saleItems]
  );
  const discountAmount = Number(form.watch("sale.discountAmount")) || 0;
  const totalCost = useMemo(
    () => calculateTotalCostForSaleItems(saleItems),
    [saleItems]
  );
  const deliveryCost = Number(form.watch("deliveryCost")) || 0;

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

  const onSubmit = async (values: EmbeddedUpdateOnlineSaleDTO) => {
    try {
      if (values.sale.saleItems.length === 0) {
        showToast("error", "Veuillez sélectionner au moins un article");
        return;
      }

      const response = await update(values);
      showToast("success", response.message);
      onSuccessCallback?.();
    } catch (error) {
      handleError(error, "Erreur lors de la création de la vente");
    }
  };

  return {
    form,
    onlineSale,
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
    deliveryCost,
  };
}
