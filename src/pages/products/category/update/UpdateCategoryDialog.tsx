import { useEffect, useState } from "react";

import CustomDialog from "@/components/common/CustomDialog";
import FormActionButtons from "@/components/common/FormActionButtons";
import UpdateAction from "@/components/common/actions/UpdateAction";
import MultiSelectField from "@/components/common/fields/MultiSelectField";
import SelectField from "@/components/common/fields/SelectField";
import TextField from "@/components/common/fields/TextField";
import ToggleField from "@/components/common/fields/ToggleField";
import { Form } from "@/components/ui/form";
import { env } from "@/config/environment";
import { useActiveAttributes } from "@/swr/products/attribute.swr";
import { Category } from "@/types/category.dto";
import handleError from "@/utils/handleError";

import useUpdateCategoryForm from "./useUpdateCategoryForm";

export function UpdateCategoryDialog({ category }: { category: Category }) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: attributes, error: attributesError } = useActiveAttributes();

  const { form, onSubmit, isSubmitting } = useUpdateCategoryForm(
    category,
    () => {
      setIsOpen(false);
    }
  );

  const selectedAttributeIds = form.watch("attributeIds");
  const primaryAttributeId = form.watch("primaryAttributeId");

  function handleOnOpenChange(value: boolean) {
    setIsOpen(value);
    form.reset();
  }

  useEffect(() => {
    if (attributesError) {
      handleError(attributesError, "Échec lors de la chargement des attributs");
    }
  }, [attributesError]);

  return (
    <CustomDialog
      trigger={<UpdateAction />}
      title="Modifier la catégorie"
      isOpen={isOpen}
      onOpenChange={handleOnOpenChange}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <TextField
            control={form.control}
            name="name"
            label="Nom de la Catégorie"
            placeholder="Saisir le nom de la catégorie"
          />

          <ToggleField
            control={form.control}
            name="isActive"
            label="Activer la Catégorie"
          />

          <MultiSelectField
            control={form.control}
            name="attributeIds"
            label="Sélectionner les attributs"
            placeholder="Sélectionner les attributs"
            options={attributes.map((attribute) => ({
              value: attribute.id,
              label: attribute.name,
            }))}
          />

          {env.ENABLE_PRIMARY_ATTRIBUTE &&
            (selectedAttributeIds || primaryAttributeId) && (
              <SelectField
                control={form.control}
                name="primaryAttributeId"
                label="Attribut primaire"
                placeholder="Sélectionner un attribut primaire"
                options={selectedAttributeIds.map((id) => ({
                  value: id,
                  label: attributes.find((attr) => attr.id === id)?.name || "",
                }))}
              />
            )}

          <FormActionButtons
            onClose={() => setIsOpen(false)}
            isSubmitting={isSubmitting}
            submitLabel="Mettre à jour"
            submittingLabel="Mise à jour..."
          />
        </form>
      </Form>
    </CustomDialog>
  );
}

export default UpdateCategoryDialog;
