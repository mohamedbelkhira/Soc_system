import { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import CustomDialog from "@/components/common/CustomDialog";
import FormActionButtons from "@/components/common/FormActionButtons";
// Components

import TextField from "@/components/common/fields/TextField";
import TwoColumns from "@/components/common/layouts/TwoColumns";
import { Form } from "@/components/ui/form";
import { createClientSchema } from "@/schemas/clients/client.schema";
import { useCreateClient } from "@/swr/client/client.swr";
// Types

import { CreateClientDTO } from "@/types/clients/client.dto";
import handleError from "@/utils/handleError";
import { showToast } from "@/utils/showToast";
import { zodResolver } from "@hookform/resolvers/zod";

const DEFAULT_FORM_VALUES: CreateClientDTO = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  email: null,
  address: null,
};

export function CreateClientDialog({
  trigger,
  isPhoneRequired = false,
  isAddressRequired = false,
  onSuccess,
}: {
  trigger: ReactNode;
  isPhoneRequired?: boolean;
  isAddressRequired?: boolean;
  onSuccess?: (clientId: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { create, isCreating, error } = useCreateClient();

  useEffect(() => {
    if (error) {
      handleError(error, "Échec de la création du client");
    }
  }, [error]);

  const form = useForm<CreateClientDTO>({
    resolver: zodResolver(
      createClientSchema({ isPhoneRequired, isAddressRequired })
    ),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const handleFormReset = () => {
    form.reset(DEFAULT_FORM_VALUES);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (values: CreateClientDTO) => {
    try {
      const submitData: CreateClientDTO = {
        ...values,
        email: values.email?.trim() || null,
        address: values.address?.trim() || null,
      };

      const response = await create(submitData);

      showToast(response.status, response.message ?? "Client créé avec succès");
      onSuccess?.(response.data.id);
      handleClose();
      handleFormReset();
    } catch (error) {
      handleError(error, "Échec de la création du client");
    }
  };

  return (
    <CustomDialog
      trigger={trigger}
      title="Créer un nouveau client"
      isOpen={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          handleFormReset();
        }
      }}
    >
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit(handleSubmit)(e);
          }}
          className="md:w-[680px] space-y-4"
        >
          <TwoColumns>
            <TextField
              control={form.control}
              name="firstName"
              label="Prénom"
              placeholder="Saisir le prénom du client"
            />

            <TextField
              control={form.control}
              name="lastName"
              label="Nom"
              placeholder="Saisir le nom du client"
            />

            <TextField
              control={form.control}
              name="phoneNumber"
              label={`Numéro de téléphone${!isPhoneRequired ? " (optionnel)" : ""}`}
              placeholder="Saisir le numéro de téléphone"
            />
            <TextField
              control={form.control}
              name="email"
              label="Email (optionnel)"
              placeholder="Saisir l'email du client"
            />

            <TextField
              control={form.control}
              name="address"
              label={`Adresse${!isAddressRequired ? " (optionnelle)" : ""}`}
              placeholder="Saisir l'adresse du client"
            />
          </TwoColumns>

          <FormActionButtons
            onClose={handleClose}
            isSubmitting={isCreating}
            submitLabel="Créer"
            submittingLabel="Création..."
          />
        </form>
      </Form>
    </CustomDialog>
  );
}
