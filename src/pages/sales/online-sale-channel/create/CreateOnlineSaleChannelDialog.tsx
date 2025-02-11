import { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

// Components
import CustomDialog from "@/components/common/CustomDialog";
import FormActionButtons from "@/components/common/FormActionButtons";
import TextAreaField from "@/components/common/fields/TextAreaField";
import TextField from "@/components/common/fields/TextField";
import { Form } from "@/components/ui/form";
import { createOnlineSaleChannelSchema } from "@/schemas/sales/online-sale-channel.schema";
import { useCreateOnlineSaleChannel } from "@/swr/sales/online-sale-channel.swr";
// Types
import { CreateOnlineSaleChannelDTO } from "@/types/sales/online-sale-channel.dto";
import handleError from "@/utils/handleError";
import { showToast } from "@/utils/showToast";
import { zodResolver } from "@hookform/resolvers/zod";

const DEFAULT_FORM_VALUES: CreateOnlineSaleChannelDTO = {
  name: "",
  description: "",
  isActive: true,
};

export function CreateOnlineSaleChannelDialog({
  trigger,
  onSuccess,
}: {
  trigger: ReactNode;
  onSuccess?: (channelId: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { createOnlineSaleChannel, isLoading } = useCreateOnlineSaleChannel();

  const form = useForm<CreateOnlineSaleChannelDTO>({
    resolver: zodResolver(createOnlineSaleChannelSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  useEffect(() => {
    if (!isOpen) {
      form.reset(DEFAULT_FORM_VALUES);
    }
  }, [form, isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (values: CreateOnlineSaleChannelDTO) => {
    try {
      const response = await createOnlineSaleChannel(values);
      showToast(response.status, response.message);
      console.log(response.data);

      onSuccess?.(response.data.id);
      handleClose();
    } catch (error) {
      handleError(error, "Échec de la création du canal de vente en ligne");
    }
  };

  return (
    <CustomDialog
      trigger={trigger}
      title="Créer un nouveau canal de vente en ligne"
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit(handleSubmit)(e);
          }}
          className="space-y-4"
        >
          <TextField
            control={form.control}
            name="name"
            label="Nom de la canal"
            placeholder="Saisir le nom du canal"
          />
          <TextAreaField
            control={form.control}
            name="description"
            label="Description"
            placeholder="Saisir la description du canal"
          />

          <FormActionButtons
            onClose={handleClose}
            isSubmitting={isLoading}
            submitLabel="Créer"
            submittingLabel="Création..."
          />
        </form>
      </Form>
    </CustomDialog>
  );
}
