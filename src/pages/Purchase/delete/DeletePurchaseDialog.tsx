import { ReactNode, useState } from "react";
import CustomDialog from "@/components/common/CustomDialog";
import { Button } from "@/components/ui/button";
import { Purchase } from "@/types/purchase.dto";
import { showToast } from "@/utils/showToast";
import { AxiosError } from "axios";
import { useDeletePurchase } from "@/swr/purchase.swr";
import { getErrorMessage } from "@/utils/getErrorMessage";

export default function DeletePurchaseDialog({
  purchase,
  trigger,
}: {
  purchase: Purchase;
  trigger: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { deletePurchase, isLoading } = useDeletePurchase(purchase.id);

  const handleDelete = async () => {
    try {

      const response = await deletePurchase();
      
      showToast(response.status, response.message);
      setIsOpen(false);
    } catch (err) {
      const error = err as AxiosError;
      showToast(
        "error",
        getErrorMessage(error, "Échec de la suppression de l'achat")
      );
    }
  };

  return (
    <CustomDialog
      trigger={trigger}
      title={`Supprimer l'achat `}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <div className="space-y-4">
        <p>
          Êtes-vous sûr de vouloir supprimer l'achat ? Cette action est irréversible.
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