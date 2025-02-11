// src/components/purchaseFees/UpdatePurchaseFeeDialog.tsx

import { useEffect, useState } from "react";
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
import { UpdatePurchaseFeeDTO, updatePurchaseFeeSchema } from "@/types/purchaseFee.dto";
import { purchaseFeesApi } from "@/api/purchaseFees.api";
import UpdateAction from "@/components/common/actions/UpdateAction";

import { PurchaseFee } from "@/types/purchaseFee.dto";

export function UpdatePurchaseFeeDialog({
  purchaseFee,
  onUpdate,
}: {
  purchaseFee: PurchaseFee;
  onUpdate?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UpdatePurchaseFeeDTO>({
    resolver: zodResolver(updatePurchaseFeeSchema),
    defaultValues: {
      name: purchaseFee.name,
      description: purchaseFee.description,
      isActive: purchaseFee.isActive,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: purchaseFee.name,
        description: purchaseFee.description,
        isActive: purchaseFee.isActive,
      });
    }
  }, [isOpen, purchaseFee, form]);

  const onSubmit = async (values: UpdatePurchaseFeeDTO) => {
    setIsSubmitting(true);

    try {
      const response = await purchaseFeesApi.update(purchaseFee.id, values);
      showToast(response.status, response.message);
      setIsOpen(false);
      onUpdate?.();
    } catch (err) {
      const error = err as AxiosError;
      showToast(
        "error",
        (error.response?.data as ApiErrorResponse).message ||
          "Error lors de la mise à jour de cette catégorie de frais d'achats"
      );
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomDialog
      trigger={<UpdateAction />}
      title="Modifier la catégorie de frais d'achats"
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
                    placeholder="Enter description"
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
              {isSubmitting ? 'Mise à jour...' : 'Mettre à jour'}
            </Button>
          </div>
        </form>
      </Form>
    </CustomDialog>
  );
}

export default UpdatePurchaseFeeDialog;
