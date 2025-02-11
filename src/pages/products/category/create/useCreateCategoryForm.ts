import { useForm } from "react-hook-form";

import { createCategorySchema } from "@/schemas/category.schema";
import { useCreateCategory } from "@/swr/products/category.swr";
import { CreateCategoryDTO } from "@/types/category.dto";
import handleError from "@/utils/handleError";
import showToast from "@/utils/showToast";
import { zodResolver } from "@hookform/resolvers/zod";

export default function useCreateCategoryForm(onSuccessCallback: () => void) {
  const { create, isCreating, error } = useCreateCategory();

  const form = useForm<CreateCategoryDTO>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      attributeIds: [],
      primaryAttributeId: "",
    },
  });

  const onSubmit = async (data: CreateCategoryDTO) => {
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
      const response = await create(payload);

      if (error) {
        handleError(error, "Échec de la création de la catégorie");
      } else {
        showToast(response.status, response.message);
        onSuccessCallback();
        form.reset();
      }
    } catch (error) {
      handleError(error, "Échec de la création de la catégorie");
    }
  };

  return {
    form,
    isSubmitting: isCreating,
    onSubmit,
  };
}
