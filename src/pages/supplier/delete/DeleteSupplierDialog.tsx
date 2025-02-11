import { useState } from "react";
import CustomDialog from "@/components/common/CustomDialog";
import { Button } from "@/components/ui/button";
import { suppliersApi } from "@/api/suppliers.api";
import { showToast } from "@/utils/showToast";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/types/error.type";
import { Trash2 } from "lucide-react";


interface DeleteSupplierDialogProps {
  supplier: {
    id: string;
    name: string;
  };
  onDelete?: () => void;
}

export default function DeleteSupplierDialog({
  supplier,
  onDelete: onDeleteSuccess,
}: DeleteSupplierDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await suppliersApi.delete(supplier.id);

      showToast(response.status, response.message);
      onDeleteSuccess?.();
      setIsOpen(false);
    } catch (err) {
      const error = err as AxiosError;
      showToast(
        "error",
        (error.response?.data as ApiErrorResponse).message ??
          "Échec de la suppression du fournisseur"
      );
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <CustomDialog
      trigger={
        <Button variant="ghost" size="icon">
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      }
      title={`Supprimer le fournisseur "${supplier.name}"`}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <div className="space-y-4">
        <p>
          Êtes-vous sûr de vouloir supprimer le fournisseur{" "}
          <span className="font-semibold">{supplier.name}</span> ? Cette action
          est irréversible.
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