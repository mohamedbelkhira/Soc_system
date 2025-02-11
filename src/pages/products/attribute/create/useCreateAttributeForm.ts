import {  useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "@/utils/showToast";
import {
  AttributeType,
  createAttributeSchema,
} from "@/schemas/attribute.schema";
import { CreateAttributeDTO } from "@/types/attribute.dto";
import handleError from "@/utils/handleError";
import { useCreateAttribute } from "@/swr/products/attribute.swr";

export default function useCreateAttributeForm(onSuccessCallback: () => void) {
  const { create, isCreating, error } = useCreateAttribute();

  const form = useForm<CreateAttributeDTO>({
    resolver: zodResolver(createAttributeSchema),
    defaultValues: {
      name: "",
      type: AttributeType.STRING,
    },
  });

  const onSubmit = async (data: CreateAttributeDTO) => {
    try {
      const response = await create(data);

      if (error) {
        handleError(error, "Échec de la création de l'attribut");
      } else {
        showToast(response.status, response.message);
        onSuccessCallback();
        form.reset();
      }
    } catch (error) {
      handleError(error, "Échec de la création de l'attribut");
    }
  };

  return {
    form,
    isSubmitting: isCreating,
    onSubmit,
  };
}
