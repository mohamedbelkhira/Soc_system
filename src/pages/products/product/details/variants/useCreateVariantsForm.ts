import { useState } from "react";
import { useForm } from "react-hook-form";

import { reducedCreateVariantSchema } from "@/schemas/variant.schema";
import { useCreateVariant } from "@/swr/products/variant.swr";
import { Product } from "@/types/product.dto";
import { ReducedCreateVariantDTO } from "@/types/variant.dto";
import generateVariantCombinations from "@/utils/generateVariantCombinations";
import handleError from "@/utils/handleError";
import { showToast } from "@/utils/showToast";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";

const DEFAULT_FORM_VALUES: ReducedCreateVariantDTO = {
  attributeValues: {},
};

export default function useCreateVariantsForm(
  product: Product,
  onSuccessCallback?: () => void
) {
  const [isOpen, setIsOpen] = useState(false);
  const { create, isCreating, error } = useCreateVariant();

  // Initialize form
  const form = useForm<ReducedCreateVariantDTO>({
    resolver: zodResolver(reducedCreateVariantSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const handleFormReset = () => {
    form.reset(DEFAULT_FORM_VALUES);
  };

  const handleClose = () => {
    setIsOpen(false);
    handleFormReset();
  };

  const onSubmit = async (values: ReducedCreateVariantDTO) => {
    try {
      const attributes = product.category.categoryAttributes;
      const variantsCombinations = generateVariantCombinations(
        attributes,
        values.attributeValues
      );

      await Promise.all(
        variantsCombinations.map((variant) =>
          create({
            productId: product.id,
            attributeValues: variant,
          })
        )
      );
      if (error) {
        console.log({ error }, variantsCombinations.length);

        const axiosError = error as AxiosError;
        if (
          axiosError?.response?.status === 409 &&
          variantsCombinations.length > 1
        ) {
          showToast("success", "Variantes créées avec succès");
          onSuccessCallback?.();
          handleClose();
        } else {
          handleError(error, "Échec de la création de variantes");
        }
      } else {
        showToast("success", "Variantes créées avec succès");
        onSuccessCallback?.();
        handleClose();
      }
    } catch (error) {
      handleError(error, "Échec de la création de variantes");
    }
  };

  return {
    form,
    isOpen,
    setIsOpen,
    isSubmitting: isCreating,
    handleClose,
    onSubmit,
  };
}
