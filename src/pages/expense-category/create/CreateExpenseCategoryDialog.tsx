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
import { CreateExpenseCategoryDTO } from "@/types/expenseCategory.dto";
import { createExpenseCategorySchema } from "@/schemas/expenseCategory.schema";
import { useCreateExpenseCategory } from "@/swr/expenseCategory.swr";
import AddButton from "@/components/common/AddButton";

export function CreateExpenseCategoryDialog({ onCreate }: { onCreate?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const { trigger, isMutating } = useCreateExpenseCategory();

  const form = useForm<CreateExpenseCategoryDTO>({
    resolver: zodResolver(createExpenseCategorySchema),
    defaultValues: {
      name: "",
      description: null,
      type: "GLOBAL",
    },
  });

  const onSubmit = async (values: CreateExpenseCategoryDTO) => {
    try {
      await trigger(values);
      showToast("success", "Catégorie de dépenses créée avec succès");
      setIsOpen(false);
      form.reset();
      onCreate?.();
    } catch (err) {
      const error = err as AxiosError;
      showToast(
        "error",
        (error.response?.data as ApiErrorResponse)?.message ??
          "Échec de la création de la catégorie"
      );
      console.error(error);
    }
  };

  return (
    <CustomDialog
      trigger={<AddButton label="Ajouter une Catégorie" />}
      title="Créer une nouvelle catégorie de dépense"
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
                <FormLabel>Nom de la Catégorie</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Saisir le nom de la catégorie"
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
                    placeholder="Saisir la description de la catégorie"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value || null)}
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
              disabled={isMutating}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isMutating}>
              {isMutating ? "Création..." : "Créer"}
            </Button>
          </div>
        </form>
      </Form>
    </CustomDialog>
  );
}

export default CreateExpenseCategoryDialog;