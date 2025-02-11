import { useCallback, useEffect, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import {
  OnlineSaleStatus,
  embeddedCreateOnlineSaleSchema,
} from "@/schemas/sales/online-sale.schema";
import { SaleCategory, SaleType } from "@/schemas/sales/sale.schema";
import { useCreateOnlineSale } from "@/swr/sales/online-sale.swr";
import { DeliveryHandler } from "@/types/deliveryHandler.dto";
import { EmbeddedCreateOnlineSaleDTO } from "@/types/sales/online-sale.dto";
import { SaleItem } from "@/types/sales/sale-Item.dto";
import calculateTotalAmountForSaleItems from "@/utils/calculateTotalAmountForSaleItems";
import calculateTotalCostForSaleItems from "@/utils/calculateTotalCostForSaleItems";
import handleError from "@/utils/handleError";
import { showToast } from "@/utils/showToast";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export default function useCreateOnlineSaleForm(
  locationId: string | undefined,
  deliveryHandlers: DeliveryHandler[],
  onSuccessCallback?: () => void
) {
  const { create, isCreating } = useCreateOnlineSale();

  const form = useForm<z.infer<typeof embeddedCreateOnlineSaleSchema>>({
    resolver: zodResolver(embeddedCreateOnlineSaleSchema),
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
      deliveryHandlerId: null,
      deliveryCost: 0,
      returnCost: 0,
      status: OnlineSaleStatus.PENDING,
    },
  });

  useEffect(() => {
    if (locationId) {
      form.setValue("sale.locationId", locationId);
    }
  }, [form, locationId]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "sale.saleItems",
  });

  const saleItems = form.watch("sale.saleItems");

  useEffect(() => {
    if (form.watch("status") === OnlineSaleStatus.COMPLETED) {
      form.setValue("completedAt", new Date().toISOString());
    }
  }, [form.watch("status")]);

  useEffect(() => {
    form.setValue(
      "sale.totalAmount",
      calculateTotalAmountForSaleItems(saleItems)
    );
  }, [form, saleItems]);

  useEffect(() => {
    const deliveryHandler = deliveryHandlers.find(
      (handler) => handler.id === form.watch("deliveryHandlerId")
    );

    if (!deliveryHandler) {
      return;
    }

    form.setValue("deliveryCost", Number(deliveryHandler.deliveryCost));
    form.setValue("returnCost", Number(deliveryHandler.returnCost));
  }, [deliveryHandlers, form, form.watch("deliveryHandlerId")]);

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

  const onSubmit = async (values: EmbeddedCreateOnlineSaleDTO) => {
    try {
      if (values.sale.saleItems.length === 0) {
        showToast("error", "Veuillez sélectionner au moins un article");
        return;
      }

      const response = await create(values);
      showToast("success", response.message);
      onSuccessCallback?.();
    } catch (error) {
      handleError(error, "Erreur lors de la création de la vente");
    }
  };

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

  return {
    form,
    fields,
    isCreating,
    onSubmit,
    handleSaleItemsAdd,
    remove,
    saleItems,
    totalAmount,
    totalCost,
    discountAmount,
    deliveryCost,
  };
}
