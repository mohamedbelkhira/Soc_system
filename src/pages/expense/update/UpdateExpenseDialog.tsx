import { useState, useEffect } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "@/utils/showToast";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/types/error.type";
import CustomDialog from "@/components/common/CustomDialog";
import { UpdateExpenseDTO, Expense } from "@/types/expense.dto";
import { updateExpenseSchema } from "@/schemas/expense.schema";
import { useUpdateExpense } from "@/swr/expense.swr";
import PreSelectField from "@/components/common/fields/PreSelectField";
import DateField from "@/components/common/fields/DateField";
import TextAreaField from "@/components/common/fields/TextAreaField";
import GenericNumberField from "@/components/common/fields/GenericNumberField";
import { useExpenseCategories } from "@/swr/expenseCategory.swr";
import UpdateAction from "@/components/common/actions/UpdateAction";
import handleError from "@/utils/handleError";
interface UpdateExpenseDialogProps {
  expense: Expense;
  onUpdate?: () => void;
}

export default function UpdateExpenseDialog({
  expense,
}: UpdateExpenseDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { updateExpense, isLoading } = useUpdateExpense(expense.id);
  const { data: categories, error: categoriesError, isLoading: categoriesLoading } = useExpenseCategories();

  const form = useForm<UpdateExpenseDTO>({
    resolver: zodResolver(updateExpenseSchema),
    defaultValues: {
      id: expense.id,
      categoryId: expense.categoryId,
      description: expense.description || "",
      status: expense.status,
      paidAt: expense.paidAt || null,
      dueAt: expense.dueAt || null,
      amount: parseFloat(String(expense.amount)),
    },
  });

  // Store original dates
  const [originalPaidAt] = useState<string | null>(expense.paidAt ?? null);
  const [originalDueAt] = useState<string | null>(expense.dueAt ?? null);

  // Watch the 'status' field to determine which date field to show
  const status = form.watch("status");

  // Reset the form when the dialog is opened
  useEffect(() => {
    if (isOpen) {
      form.reset({
        id: expense.id,
        categoryId: expense.categoryId,
        description: expense.description || "",
        status: expense.status,
        paidAt: expense.paidAt || null,
        dueAt: expense.dueAt || null,
        amount: parseFloat(String(expense.amount)),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, expense]);

  // Clear or restore date fields based on status
  useEffect(() => {
    if (status === "PAID") {
      // Restore paidAt to original value if exists
      form.setValue("dueAt", null);
      form.setValue("paidAt", originalPaidAt);
    } else if (status === "PENDING") {
      // Restore dueAt to original value if exists
      form.setValue("paidAt", null);
      form.setValue("dueAt", originalDueAt);
    } else if (status === "CANCELED") {
      // Clear both dates
      form.setValue("paidAt", null);
      form.setValue("dueAt", null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const onSubmit = async (values: UpdateExpenseDTO) => {
    try {
      const response = await updateExpense(values);
       showToast("success", response.message);
      setIsOpen(false);
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      console.error("Error during update:", error);
      handleError(error, "erreur");
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
    { value: "CANCELED", label: "Annulée" },
  ];

  // Handle category loading error
  useEffect(() => {
    if (categoriesError) {
      showToast("error", "Erreur de chargement des catégories de dépenses.");
    }
  }, [categoriesError]);

  return (
    <CustomDialog
      trigger={<UpdateAction />}
      title="Modifier la dépense"
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
              {isLoading ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </div>
        </form>
      </Form>
    </CustomDialog>
  );
}