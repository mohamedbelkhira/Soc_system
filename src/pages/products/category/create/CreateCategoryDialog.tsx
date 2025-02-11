import { useEffect, useState } from "react";

import AddButton from "@/components/common/AddButton";
import CustomDialog from "@/components/common/CustomDialog";
import FormActionButtons from "@/components/common/FormActionButtons";
import MultiSelectField from "@/components/common/fields/MultiSelectField";
import SelectField from "@/components/common/fields/SelectField";
import TextField from "@/components/common/fields/TextField";
import { Form } from "@/components/ui/form";
import { env } from "@/config/environment";
import { useActiveAttributes } from "@/swr/products/attribute.swr";
import handleError from "@/utils/handleError";

import useCreateCategoryForm from "./useCreateCategoryForm";

export function CreateCategoryDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: attributes, error: attributesError } = useActiveAttributes();

  const { form, onSubmit, isSubmitting } = useCreateCategoryForm(() => {
    setIsOpen(false);
  });

  const selectedAttributeIds = form.watch("attributeIds");

  function handleOnOpenChange(value: boolean) {
    setIsOpen(value);
    form.reset();
  }

  useEffect(() => {
    if (attributesError) {
      console.error(attributesError);

      handleError(attributesError, "Échec lors de la chargement des attributs");
    }
  }, [attributesError]);

  return (
    <CustomDialog
      trigger={<AddButton label="Ajouter une Catégorie" />}
      title="Créer une nouvelle catégorie"
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

          <MultiSelectField
            control={form.control}
            name="attributeIds"
            label="Attributs"
            placeholder="Sélectionner les attributs"
            emptyMessage="Aucun attribut trouvé"
            options={attributes.map((attribute) => ({
              value: attribute.id,
              label: attribute.name,
            }))}
          />

          {env.ENABLE_PRIMARY_ATTRIBUTE && selectedAttributeIds.length > 0 && (
            <SelectField
              control={form.control}
              name="primaryAttributeId"
              label="Attribut principal"
              placeholder="Sélectionner un attribut principal"
              options={selectedAttributeIds.map((id) => ({
                value: id,
                label: attributes.find((attr) => attr.id === id)?.name || "",
              }))}
            />
          )}

          <FormActionButtons
            onClose={() => {
              setIsOpen(false);
            }}
            isSubmitting={isSubmitting}
            submitLabel="Créer"
            submittingLabel="Création..."
          />
        </form>
      </Form>
    </CustomDialog>
  );
}
