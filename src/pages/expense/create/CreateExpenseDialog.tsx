import { useState, useEffect } from "react";
import {
  Form,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "@/utils/showToast";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/types/error.type";
import CustomDialog from "@/components/common/CustomDialog";
import { CreateExpenseDTO } from "@/types/expense.dto";
import { createExpenseSchema } from "@/schemas/expense.schema";
import { useCreateExpense } from "@/swr/expense.swr";
import AddButton from "@/components/common/AddButton";
import PreSelectField from "@/components/common/fields/PreSelectField";
import DateField from "@/components/common/fields/DateField";
import TextAreaField from "@/components/common/fields/TextAreaField";
import GenericNumberField from "@/components/common/fields/GenericNumberField";
import { useExpenseCategories } from "@/swr/expenseCategory.swr";

export function CreateExpenseDialog({ onCreate }: { onCreate?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const { trigger, isLoading } = useCreateExpense();
  const { data: categories, error: categoriesError, isLoading: categoriesLoading } = useExpenseCategories();

  const form = useForm<CreateExpenseDTO>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: {
      categoryId: "",
      description: "",
      status: "PENDING",
      paidAt: null,
      dueAt: null,
      amount: 0,
    },
  });

  const status = form.watch("status");
  useEffect(() => {
    if (status === "PAID") {
      form.setValue("dueAt", null);
    } else if (status === "PENDING") {
      form.setValue("paidAt", null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const onSubmit = async (values: CreateExpenseDTO) => {
    try {
      const repsone= await trigger(values);
      showToast("success", repsone.message);
      setIsOpen(false);
      form.reset();
      onCreate?.();
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      showToast(
        "error",
        error.response?.data?.message || "Échec de la création de la dépense"
      );
      console.error(error);
    }
  };

  // Prepare options for category selection
  const categoryOptions = categories
    ? categories.map((category) => ({
        value: category.id,
        label: category.name,
      }))
    : [];

  // Define status options
  const statusOptions = [
    { value: "PENDING", label: "Non Payée" },
    { value: "PAID", label: "Payée" },
  ];

  // Handle category loading error
  useEffect(() => {
    if (categoriesError) {
      showToast("error", "Erreur de chargement des catégories.");
    }
  }, [categoriesError]);

  return (
    <CustomDialog
      trigger={<AddButton label="Ajouter une Dépense" />}
      title="Créer une nouvelle dépense"
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Category ID */}
          <PreSelectField
            control={form.control}
            name="categoryId"
            label="Catégorie"
            placeholder={categoriesLoading ? "Chargement..." : "Sélectionner une catégorie"}
            options={categoryOptions}
            // disabled={categoriesLoading || categoriesError}
          />

          {/* Description */}
          <TextAreaField
            control={form.control}
            name="description"
            label="Description"
            placeholder="Saisir la description de la dépense"
          />

          {/* Status */}
          <PreSelectField
            control={form.control}
            name="status"
            label="Statut"
            placeholder="Sélectionner le statut"
            options={statusOptions}
          />

          {/* Conditionally render Paid At or Due At */}
          {status === "PAID" && (
            <DateField
              control={form.control}
              name="paidAt"
              label="Date de paiement"
            />
          )}

          {status === "PENDING" && (
            <DateField
              control={form.control}
              name="dueAt"
              label="Date d'échéance"
            />
          )}

          {/* Amount */}
          <GenericNumberField
            control={form.control}
            name="amount"
            label="Montant"
          />

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Création..." : "Créer"}
            </Button>
          </div>
        </form>
      </Form>
    </CustomDialog>
  );
}

export default CreateExpenseDialog;