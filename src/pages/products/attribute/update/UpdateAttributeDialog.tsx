import { useState } from "react";

import CustomDialog from "@/components/common/CustomDialog";
import FormActionButtons from "@/components/common/FormActionButtons";
import UpdateAction from "@/components/common/actions/UpdateAction";
import TextField from "@/components/common/fields/TextField";
import ToggleField from "@/components/common/fields/ToggleField";
import { Form } from "@/components/ui/form";
import { Attribute } from "@/types/attribute.dto";

import AttributeTypeField from "../shared/AttributeTypeField";
import useUpdateAttributeForm from "./useUpdateAttributeForm";

export function UpdateAttributeDialog({ attribute }: { attribute: Attribute }) {
  const [isOpen, setIsOpen] = useState(false);
  const { form, onSubmit, isSubmitting } = useUpdateAttributeForm(
    attribute,
    () => {
      form.reset();
      setIsOpen(false);
    }
  );

  function handleOnOpenChange(value: boolean) {
    setIsOpen(value);
    form.reset();
  }

  return (
    <CustomDialog
      trigger={<UpdateAction />}
      title="Modifier l'attribut"
      isOpen={isOpen}
      onOpenChange={handleOnOpenChange}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <TextField
            control={form.control}
            name={"name"}
            label={"Nom de l'attribut"}
            placeholder={"Saisir le nom de l'attribut"}
          />

          <AttributeTypeField control={form.control} />

          <ToggleField
            control={form.control}
            name="isActive"
            label="Activer l'attribut"
          />

          <FormActionButtons
            isSubmitting={isSubmitting}
            submitLabel="Mettre à jour"
            submittingLabel="Mise à jour..."
            onClose={() => {
              setIsOpen(false);
              form.reset();
            }}
          />
        </form>
      </Form>
    </CustomDialog>
  );
}
