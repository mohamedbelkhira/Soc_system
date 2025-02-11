import { useState } from "react";
import CustomDialog from "@/components/common/CustomDialog";
import { Button } from "@/components/ui/button";
import { showToast } from "@/utils/showToast";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/types/error.type";
import { Trash2 } from "lucide-react";
import { useDeleteExpenseCategory } from "@/swr/expenseCategory.swr";

interface DeleteExpenseCategoryDialogProps {
  expenseCategory: {
    id:string;
    name:string;
  }
  onDelete?: () => void;
}


export default function DeleteExpenseCategoryDialog({
  expenseCategory,
  onDelete: onDeleteSuccess,
}: DeleteExpenseCategoryDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { trigger, isMutating } = useDeleteExpenseCategory();

  const handleDelete = async () => {
    try {
      await trigger(expenseCategory.id);
      showToast("success", "Catégorie de dépenses supprimée avec succès");
      onDeleteSuccess?.();
      setIsOpen(false);
    } catch (err) {
      const error = err as AxiosError;
      showToast(
        "error",
        (error.response?.data as ApiErrorResponse)?.message ??
        "Échec de la suppression de la catégorie"
      );
      console.error(error);
    }
  };

  return (
    <CustomDialog
      trigger={
        <Button variant="ghost" size="icon">
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      }
      title={`Supprimer la catégorie `}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <div className="space-y-4">
        <p>
          Êtes-vous sûr de vouloir supprimer la catégorie{" "}
          <span className="font-semibold">{expenseCategory.name}</span> ? 
          Cette action est irréversible.
        </p>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isMutating}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isMutating}
          >
            {isMutating ? "Suppression..." : "Supprimer"}
          </Button>
        </div>
      </div>
    </CustomDialog>
  );
}
