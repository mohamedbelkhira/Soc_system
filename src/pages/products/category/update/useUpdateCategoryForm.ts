import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { updateCategorySchema } from "@/schemas/category.schema";
import { useUpdateCategory } from "@/swr/products/category.swr";
import { Category, UpdateCategoryDTO } from "@/types/category.dto";
import categoryAttributesToAttributeIds from "@/utils/adapters/categoryAttributesToAttributeIds";
import getPrimaryAttributeId from "@/utils/getPrimaryAttributeId";
import handleError from "@/utils/handleError";
import { showToast } from "@/utils/showToast";
import { zodResolver } from "@hookform/resolvers/zod";

export default function useUpdateCategoryForm(
  category: Category,
  onSuccessCallback: () => void
) {
  const { update, isUpdating, error } = useUpdateCategory(category.id);

  const form = useForm<UpdateCategoryDTO>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      id: category.id,
    },
  });

  useEffect(() => {
    form.reset({
      id: category.id,
      name: category.name,
      attributeIds: categoryAttributesToAttributeIds(
        category.categoryAttributes
      ),
      primaryAttributeId: getPrimaryAttributeId(category.categoryAttributes),
      isActive: category.isActive,
    });
  }, [form, category]);

  const onSubmit = async (data: UpdateCategoryDTO) => {
    try {
      const { attributeIds, primaryAttributeId, ...categoryData } = data;
      const payload = {
        ...categoryData,
        attributes: attributeIds.map((attributeId) => {
          return {
            attributeId,
            isPrimary: attributeId === primaryAttributeId,
          };
        }),
      };
      const response = await update(payload);

      if (error) {
        handleError(error, "Échec de la mise à jour de la catégorie");
      } else {
        showToast(response.status, response.message);
        onSuccessCallback();
        form.reset();
      }
    } catch (error) {
      handleError(error, "Échec de la mise à jour de la catégorie");
    }
  };

  return {
    form,
    isSubmitting: isUpdating,
    onSubmit,
  };
}
