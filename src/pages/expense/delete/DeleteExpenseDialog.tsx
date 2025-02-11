// src/components/delete/DeleteExpenseDialog.tsx

import { ReactNode, useState } from "react";
import CustomDialog from "@/components/common/CustomDialog";
import { Button } from "@/components/ui/button";
import { showToast } from "@/utils/showToast";
import { AxiosError } from "axios";
import { useDeleteExpense } from "@/swr/expense.swr";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { Expense } from "@/types/expense.dto";



export default function DeleteExpenseDialog({
  expense,
  trigger,
}: {
expense: Expense,
trigger: ReactNode,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { deleteExpense, isLoading } = useDeleteExpense(expense.id);

  const handleDelete = async () => {
    try {
      const response= await deleteExpense();
      showToast(response.status, response.message);
      setIsOpen(false);
    } catch (err) {
      const error = err as AxiosError;
      showToast(
        "error",
        getErrorMessage(error, "Échec de la suppression de l'achat")
   
      );
      console.error(error);
    }
  };

  return (
    <CustomDialog
     trigger={trigger}
      title="Supprimer la dépense"
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <div className="space-y-4">
        <p>
          Êtes-vous sûr de vouloir supprimer cette dépense ? 
          Cette action est irréversible.
        </p>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
           {isLoading ? "Suppression..." : "Supprimer"}
          </Button>
        </div>
      </div>
    </CustomDialog>
  );
}
