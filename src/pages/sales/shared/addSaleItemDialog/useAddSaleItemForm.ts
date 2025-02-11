import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { Product } from "@/types/product.dto";
import { SaleItem } from "@/types/sales/sale-Item.dto";
import getVariantName from "@/utils/getVariantName";
import getVariantQuantity from "@/utils/getVariantQuantity";
import calculateVariantStock from "@/utils/getVariantStock";
import { showToast } from "@/utils/showToast";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  AddSaleItemFormValues,
  DEFAULT_FORM_VALUES,
  addSaleItemSchema,
} from "./schema";
import {
  adjustStockWithRemovedItems,
  calculateStockItems,
  findProductById,
  findVariantById,
} from "./utils";

interface UseAddSaleItemFormProps {
  locationId: string;
  products: Product[];
  removedSaleItems?: SaleItem[];
  onAdd: (item: SaleItem) => void;
}

export const useAddSaleItemForm = ({
  locationId,
  products,
  removedSaleItems = [],
  onAdd,
}: UseAddSaleItemFormProps) => {
  const form = useForm<AddSaleItemFormValues>({
    resolver: zodResolver(addSaleItemSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const { productId, variantId } = form.watch();

  const selectedProduct = useMemo(
    () => findProductById(products, productId),
    [productId, products]
  );

  const selectedVariant = useMemo(() => {
    if (!selectedProduct) return null;
    return findVariantById(selectedProduct.variants, variantId);
  }, [variantId, selectedProduct]);

  useEffect(() => {
    if (selectedProduct && !selectedProduct.hasVariants) {
      form.setValue("variantId", selectedProduct.variants[0].id);
    }
  }, [form, selectedProduct]);

  const maxQuantity = useMemo(() => {
    if (!selectedVariant) return 0;

    const variantStock = calculateVariantStock(locationId, selectedVariant);
    const removedQuantity = removedSaleItems
      .filter(
        (item) =>
          item.productId === selectedProduct?.id &&
          item.variantId === selectedVariant.id
      )
      .reduce(
        (total, item) =>
          total +
          item.details.reduce((sum, detail) => sum + detail.quantity, 0),
        0
      );

    return variantStock + removedQuantity;
  }, [locationId, selectedProduct, selectedVariant, removedSaleItems]);

  // For the output
  const productOptions = useMemo(
    () =>
      products.map((product) => ({
        value: product.id,
        label: product.name + " - " + product.brand,
      })),
    [products]
  );

  const variantOptions = useMemo(
    () =>
      selectedProduct?.variants.map((variant) => ({
        value: variant.id,
        label:
          getVariantName(variant) +
          " (" +
          `${getVariantQuantity(variant)} en stock)`,
      })) || [],
    [selectedProduct]
  );

  const handleSubmit = useCallback(
    (values: AddSaleItemFormValues, event?: React.BaseSyntheticEvent) => {
      event?.preventDefault();
      event?.stopPropagation();

      if (!selectedProduct || !selectedVariant) return;

      try {
        const adjustedStocks = adjustStockWithRemovedItems(
          selectedVariant.currentStock,
          removedSaleItems,
          locationId
        );

        const { stockDetails } = calculateStockItems(
          adjustedStocks,
          locationId,
          values.quantity
        );

        const price = Number(
          selectedVariant.hasCustomPrice
            ? selectedVariant.retailPrice
            : selectedProduct.retailPrice
        );

        const saleItem: SaleItem = {
          productId: selectedProduct.id,
          variantId: selectedVariant.id,
          productName: selectedProduct.name,
          variantName: getVariantName(selectedVariant),
          price,
          weight: selectedProduct.weight,
          details: stockDetails,
        };

        onAdd(saleItem);
        showToast("success", "Article ajouté avec succès");
        form.reset(DEFAULT_FORM_VALUES);
      } catch {
        showToast(
          "error",
          "Stock insuffisant pour répondre à la quantité demandée"
        );
      }
    },
    [
      selectedProduct,
      selectedVariant,
      locationId,
      removedSaleItems,
      onAdd,
      form,
    ]
  );

  return {
    form,
    selectedProduct,
    selectedVariant,
    handleSubmit,
    productOptions,
    variantOptions,
    maxQuantity,
  };
};
