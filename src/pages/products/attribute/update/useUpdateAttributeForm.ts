import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { updateAttributeSchema } from "@/schemas/attribute.schema";
import { useUpdateAttribute } from "@/swr/products/attribute.swr";
import { Attribute, UpdateAttributeDTO } from "@/types/attribute.dto";
import handleError from "@/utils/handleError";
import { showToast } from "@/utils/showToast";
import { zodResolver } from "@hookform/resolvers/zod";

export default function useUpdateAttributeForm(
  attribute: Attribute,
  onSuccessCallback: () => void
) {
  const { update, isUpdating, error } = useUpdateAttribute(attribute.id);

  const form = useForm<UpdateAttributeDTO>({
    resolver: zodResolver(updateAttributeSchema),
    defaultValues: {
      id: attribute.id,
    },
  });

  useEffect(() => {
    form.reset({
      id: attribute.id,
      name: attribute.name,
      type: attribute.type,
      isActive: attribute.isActive,
    });
  }, [form, attribute]);

  const onSubmit = async (data: UpdateAttributeDTO) => {
    try {
      const response = await update(data);

      if (error) {
        handleError(error, "Échec de la mise à jour de l'attribut");
      } else {
        showToast(response.status, response.message);
        form.reset();
        onSuccessCallback();
      }
    } catch (error) {
      handleError(error, "Échec de la mise à jour de l'attribut");
    }
  };

  return {
    form,
    isSubmitting: isUpdating,
    onSubmit,
  };
}
