import { useState } from "react";

import AddButton from "@/components/common/AddButton";
import CustomDialog from "@/components/common/CustomDialog";
import FormActionButtons from "@/components/common/FormActionButtons";
import TextField from "@/components/common/fields/TextField";
import { Form } from "@/components/ui/form";

import AttributeTypeField from "../shared/AttributeTypeField";
import useCreateAttributeForm from "./useCreateAttributeForm";

export function CreateAttributeDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const { onSubmit, isSubmitting, form } = useCreateAttributeForm(() => {
    setIsOpen(false);
  });

  function handleOnOpenChange(value: boolean) {
    setIsOpen(value);
    form.reset();
  }

  return (
    <CustomDialog
      trigger={<AddButton label="Ajouter un Attribut" />}
      title="Créer un nouvel attribut"
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

          <FormActionButtons
            onClose={() => setIsOpen(false)}
            isSubmitting={isSubmitting}
            submitLabel={"Créer"}
            submittingLabel={"Création..."}
          />
        </form>
      </Form>
    </CustomDialog>
  );
}
