import { useState } from "react";

import CustomDialog from "@/components/common/CustomDialog";
import FormActionButtons from "@/components/common/FormActionButtons";
import UpdateAction from "@/components/common/actions/UpdateAction";
import AttributeValueField from "@/components/common/fields/AttributeValueField";
import ToggleField from "@/components/common/fields/ToggleField";
import { Form } from "@/components/ui/form";
import { CategoryAttribute } from "@/types/categoryAttribute.dto";
import { Variant } from "@/types/variant.dto";

import useUpdateVariantForm from "./useUpdateVariantForm";

export default function UpdateVariantDialog({ variant }: { variant: Variant }) {
  const [isOpen, setIsOpen] = useState(false);

  const { form, isSubmitting, onSubmit } = useUpdateVariantForm(variant, () => {
    setIsOpen(false);
  });

  const renderAttributeField = (
    categoryAttribute: CategoryAttribute,
    index: number
  ) => {
    const { attribute, isPrimary } = categoryAttribute;

    const fieldName = `attributeValues.${index}.value`;

    return (
      <div key={attribute.id}>
        <input
          type="hidden"
          {...form.register(`attributeValues.${index}.attributeId`)}
          value={attribute.id}
        />
        <AttributeValueField
          control={form.control}
          type={attribute.type}
          name={fieldName}
          label={`${attribute.name} ${isPrimary ? "(Principal)" : ""}`}
          placeholder={`Saisir la valeur de ${attribute.name.toLowerCase()}`}
        />
      </div>
    );
  };
  return (
    <CustomDialog
      trigger={<UpdateAction />}
      title="Modifier la variante"
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {variant.product.category.categoryAttributes.map(
            renderAttributeField
          )}
          <ToggleField
            control={form.control}
            name="isActive"
            label="Activer la Variante"
          />
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
