// src/components/create/CreateSupplierDialog.tsx

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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "@/utils/showToast";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/types/error.type";
import CustomDialog from "@/components/common/CustomDialog";
import { suppliersApi } from "@/api/suppliers.api";
import z from "zod";
import { createSupplierSchema } from "@/types/supplier.dto";
import { CreateSupplierDTO } from "@/types/supplier.dto";
import AddButton from "@/components/common/AddButton";

export function CreateSupplierDialog({ onCreate }: { onCreate?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof createSupplierSchema>>({
    resolver: zodResolver(createSupplierSchema),
    defaultValues: {
      name: "",
      description: "",
      phoneNumber: undefined, // or you can use "" if you prefer
      address: "",
      isActive: true,
    },
  });

  const onSubmit = async (values: CreateSupplierDTO) => {
    setIsSubmitting(true);

    try {
      const response = await suppliersApi.create(values);
      showToast(response.status, response.message);
      setIsOpen(false);
      form.reset();
      onCreate?.();
    } catch (err) {
      const error = err as AxiosError;
      showToast(
        "error",
        (error.response?.data as ApiErrorResponse).message ??
          "Échec de la création du fournisseur"
      );
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomDialog
      trigger={<AddButton label="Ajouter un Fournisseur" />}
      title="Créer un nouveau fournisseur"
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
              {isSubmitting ? "Création..." : "Créer"}
            </Button>
          </div>
        </form>
      </Form>
    </CustomDialog>
  );
}

export default CreateSupplierDialog;
