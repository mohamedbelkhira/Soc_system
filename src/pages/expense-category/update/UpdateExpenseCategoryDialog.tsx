import { useEffect, useState } from "react";
import {
  Form,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "@/utils/showToast";
import { Loader2 } from "lucide-react";
import CustomDialog from "@/components/common/CustomDialog";
import UpdateAction from "@/components/common/actions/UpdateAction";
import { UpdateExpenseCategoryDTO } from "@/types/expenseCategory.dto";
import { updateExpenseCategorySchema } from "@/schemas/expenseCategory.schema";
import { useUpdateExpenseCategory, useExpenseCategories } from "@/swr/expenseCategory.swr";
import TextField from "@/components/common/fields/TextField";
import TextAreaField from "@/components/common/fields/TextAreaField";
import { ExpenseCategory } from "@/types/expenseCategory.dto";
import { AxiosError } from "axios";

interface UpdateExpenseCategoryDialogProps {
  expenseCategory: ExpenseCategory;
  onUpdate?: () => void;
}

export default function UpdateExpenseCategoryDialog({
  expenseCategory,
  onUpdate,
}: UpdateExpenseCategoryDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { trigger, isMutating } = useUpdateExpenseCategory(expenseCategory.id);
  const { mutate } = useExpenseCategories();

  const form = useForm<UpdateExpenseCategoryDTO>({
    resolver: zodResolver(updateExpenseCategorySchema),
    defaultValues: {
      name: expenseCategory.name,
      description: expenseCategory.description || "",
      type: "GLOBAL", // Assuming type is not editable; adjust if necessary
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: expenseCategory.name,
        description: expenseCategory.description || "",
        type: "GLOBAL", // Assuming type is not editable; adjust if necessary
      });
    }
  }, [isOpen, expenseCategory, form]);

  const onSubmit = async (values: UpdateExpenseCategoryDTO) => {
    try {
      // Trigger the update
      await trigger(values);

      // Mutate the SWR cache to update the table
      await mutate();

      showToast("success", "Catégorie de dépenses mise à jour avec succès.");
      setIsOpen(false);
      onUpdate?.(); // Callback to refresh data in parent component
    }catch (err)  {
        const error = err as AxiosError;
      // Handle error message from SWR mutation
      showToast(
        "error",
        error.message || "Échec de la mise à jour de la catégorie."
      );
      console.error(error);
    }
  };

  return (
    <CustomDialog
      trigger={<UpdateAction />} // Replace with your UpdateAction component or button
      title="Modifier la catégorie de dépense"
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Field */}
          <TextField
            control={form.control}
            name="name"
            label="Nom de la Catégorie"
            placeholder="Saisir le nom de la catégorie"
          />
          {/* Description Field */}
          <TextAreaField
            control={form.control}
            name="description"
            label="Description"
            placeholder="Saisir la description de la catégorie"
          />
          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isMutating}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isMutating}>
              {isMutating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Mettre à jour"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </CustomDialog>
  );
}