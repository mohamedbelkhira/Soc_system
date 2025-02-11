// src/components/update/UpdateSupplierDialog.tsx

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
import { UpdateSupplierDTO } from "@/types/supplier.dto";
import { suppliersApi } from "@/api/suppliers.api";
import { updateSupplierSchema } from "@/types/supplier.dto";
import UpdateAction from "@/components/common/actions/UpdateAction";
import { Supplier } from "@/types/supplier.dto";

export function UpdateSupplierDialog({
  supplier,
  onUpdate,
}: {
  supplier: Supplier;
  onUpdate?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UpdateSupplierDTO>({
    resolver: zodResolver(updateSupplierSchema),
    defaultValues: {
      id:supplier.id,
      name: supplier.name,
      description: supplier.description,
      phoneNumber: supplier.phoneNumber,
      address: supplier.address,
      isActive: supplier.isActive,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        id:supplier.id,
        name: supplier.name,
        description: supplier.description,
        phoneNumber: supplier.phoneNumber,
        address: supplier.address,
        isActive: supplier.isActive,
      });
    }
  }, [isOpen, supplier, form]);

  const onSubmit = async (values: UpdateSupplierDTO) => {
    setIsSubmitting(true);

    try {
      const response = await suppliersApi.update(supplier.id, values);
      showToast(response.status, response.message);
      setIsOpen(false);
      onUpdate?.();
    } catch (err) {
      const error = err as AxiosError;
      showToast(
        "error",
        (error.response?.data as ApiErrorResponse).message ||
          "Échec de la mise à jour du fournisseur"
      );
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomDialog
      trigger={<UpdateAction />}
      title="Modifier le fournisseur"
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
                <FormLabel>Nom du fournisseur</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Saisir le nom du fournisseur"
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
                    placeholder="Saisir la description du fournisseur"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Number */}
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numéro de Téléphone</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="Ex: 0566884577"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Address */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Saisir l'adresse du fournisseur"
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
                  <FormLabel>Activer le fournisseur</FormLabel>
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
              {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </div>
        </form>
      </Form>
    </CustomDialog>
  );
}

export default UpdateSupplierDialog;
