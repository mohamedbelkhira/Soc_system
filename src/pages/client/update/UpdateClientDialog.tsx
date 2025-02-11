import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import CustomDialog from "@/components/common/CustomDialog";
import FormActionButtons from "@/components/common/FormActionButtons";
import UpdateAction from "@/components/common/actions/UpdateAction";
// Components
import TextField from "@/components/common/fields/TextField";
import TwoColumns from "@/components/common/layouts/TwoColumns";
import { Form } from "@/components/ui/form";
import { createClientSchema } from "@/schemas/clients/client.schema";
import { useUpdateClient } from "@/swr/client/client.swr";
// Types
import { Client, UpdateClientDTO } from "@/types/clients/client.dto";
import handleError from "@/utils/handleError";
import { showToast } from "@/utils/showToast";
import { zodResolver } from "@hookform/resolvers/zod";

export function UpdateClientDialog({ client }: { client: Client }) {
  const [isOpen, setIsOpen] = useState(false);

  const { update, isUpdating, error } = useUpdateClient(client.id);

  useEffect(() => {
    if (error) {
      handleError(error, "Échec de la mise à jour du client");
    }
  }, [error]);

  const form = useForm<UpdateClientDTO>({
    resolver: zodResolver(createClientSchema()),
    defaultValues: {
      id: client.id,
      firstName: client.firstName,
      lastName: client.lastName,
      phoneNumber: client.phoneNumber,
      email: client.email ?? null,
      address: client.address ?? null,
    },
  });

  const handleFormReset = () => {
    form.reset({
      id: client.id,
      firstName: client.firstName,
      lastName: client.lastName,
      phoneNumber: client.phoneNumber,
      email: client.email ?? null,
      address: client.address ?? null,
    });
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (values: UpdateClientDTO) => {
    try {
      const submitData: UpdateClientDTO = {
        ...values,
        id: client.id,
        email: values.email?.trim() || null,
        address: values.address?.trim() || null,
      };

      const response = await update(submitData);
      showToast(
        response.status,
        response.message ?? "Client mis à jour avec succès"
      );
      handleClose();
    } catch (error) {
      handleError(error, "Échec de la mise à jour du client");
    }
  };

  return (
    <CustomDialog
      trigger={<UpdateAction />}
      title="Mettre à jour le client"
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
              label="Numéro de téléphone"
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
              label="Adresse (optionnel)"
              placeholder="Saisir l'adresse du client"
            />
          </TwoColumns>
          <FormActionButtons
            onClose={handleClose}
            isSubmitting={isUpdating}
            submitLabel="Mettre à jour"
            submittingLabel="Mise à jour..."
          />
        </form>
      </Form>
    </CustomDialog>
  );
}
