// src/components/purchaseFees/DeletePurchaseFeeDialog.tsx

import { useState } from "react";
import CustomDialog from "@/components/common/CustomDialog";
import { Button } from "@/components/ui/button";
import { purchaseFeesApi } from "@/api/purchaseFees.api";
import { showToast } from "@/utils/showToast";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/types/error.type";
import { Trash2 } from "lucide-react";
import { PurchaseFee } from "@/types/purchaseFee.dto";


interface DeletePurchaseFeeDialogProps {
  purchaseFee: PurchaseFee;
  onDelete?: () => void;
}

export default function DeletePurchaseFeeDialog({
  purchaseFee,
  onDelete: onDeleteSuccess,
}: DeletePurchaseFeeDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await purchaseFeesApi.delete(purchaseFee.id);
      showToast(response.status, response.message);
      onDeleteSuccess?.();
      setIsOpen(false);
    } catch (err) {
      const error = err as AxiosError;
      showToast(
        "error",
        (error.response?.data as ApiErrorResponse).message ||
          "Erreur lors de la suppression."
      );
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <CustomDialog
      trigger={
        <Button variant="ghost" size="icon" aria-label="Delete Purchase Fee">
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      }
      title={`Supprimer la catégorie "${purchaseFee.name}"`}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
       
      <div className="space-y-4">
        <p>
        Êtes-vous sûr de vouloir supprimer{" "}
          <span className="font-semibold">{purchaseFee.name}</span>? Cette Action est irréversible
        </p>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Suppression..." : "Supprimer"}
          </Button>
        </div>
      </div>
    </CustomDialog>
  );
}
