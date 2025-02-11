// src/components/purchaseFees/CreatePurchaseFeeDialog.tsx

import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "@/utils/showToast";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/types/error.type";
import CustomDialog from "@/components/common/CustomDialog";
import { CreatePurchaseFeeDTO } from "@/types/purchaseFee.dto";
import { purchaseFeesApi } from "@/api/purchaseFees.api";
import { createPurchaseFeeSchema } from "@/types/purchaseFee.dto";
import AddButton from "@/components/common/AddButton"; // Assuming you have an AddButton component

export function CreatePurchaseFeeDialog({
  onCreate,
}: {
  onCreate?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreatePurchaseFeeDTO>({
    resolver: zodResolver(createPurchaseFeeSchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
    },
  });

  const onSubmit = async (values: CreatePurchaseFeeDTO) => {
    setIsSubmitting(true);

    try {
      const response = await purchaseFeesApi.create(values);
      showToast(response.status, response.message);
      setIsOpen(false);
      onCreate?.();
    } catch (err) {
      const error = err as AxiosError;
      showToast(
        "error",
        (error.response?.data as ApiErrorResponse).message ||
          "erreur lors de la création de la catégorie de frais d'achats."
      );
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomDialog
      trigger={<AddButton label="Ajouter une catégorie de frais" />}
      title="Créer un nouvelle catégorie de frais d'achat"
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Entrer le nom"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Entrer la description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Is Active */}
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg p-3">
                <div className="space-y-0.5">
                  <FormLabel>Active</FormLabel>
                  <FormMessage />
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "creation..." : "Créer"}
            </Button>
          </div>
        </form>
      </Form>
    </CustomDialog>
  );
}

export default CreatePurchaseFeeDialog;
