import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { updateVariantSchema } from "@/schemas/variant.schema";
import { useUpdateVariant } from "@/swr/products/variant.swr";
import { UpdateVariantDTO, Variant } from "@/types/variant.dto";
import handleError from "@/utils/handleError";
import { showToast } from "@/utils/showToast";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export default function useUpdateVariantForm(
  variant: Variant,
  onSuccessCallback?: () => void
) {
  const { update, isUpdating, error } = useUpdateVariant(variant.id);

  const form = useForm<UpdateVariantDTO>({
    resolver: zodResolver(updateVariantSchema),
    defaultValues: {
      id: variant.id,
    },
  });

  useEffect(() => {
    form.reset({
      id: variant.id,
      productId: variant.productId,
      isActive: variant.isActive,
      attributeValues: variant.product.category.categoryAttributes.map(
        (catAttr) => {
          const existingValue = variant.attributeValues.find(
            (av) => av.attributeId === catAttr.attribute.id
          );
          return {
            attributeId: catAttr.attribute.id,
            value: existingValue?.value || "",
          };
        }
      ),
    });
  }, [form, variant]);

  const onSubmit = async (values: z.infer<typeof updateVariantSchema>) => {
    try {
      const response = await update(values);

      showToast(response.status, response.message);
      onSuccessCallback?.();
      form.reset();
    } catch (error) {
      handleError(error, "Échec de la mise à jour de la variante");
    }
  };

  return {
    form,
    isSubmitting: isUpdating,
    onSubmit,
  };
}
