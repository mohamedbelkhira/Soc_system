import { ReactNode } from "react";

import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog";
import { useDeleteAdvanceSale } from "@/swr/sales/advance-sale.swr";
import { AdvanceSale } from "@/types/sales/advance-sale.dto";
import handleError from "@/utils/handleError";
import { showToast } from "@/utils/showToast";

export default function DeleteAdvanceSaleDialog({
  advanceSale,
  trigger,
}: {
  advanceSale: AdvanceSale;
  trigger: ReactNode;
}) {
  const { delete: remove, isDeleting } = useDeleteAdvanceSale(advanceSale.id);

  const handleDelete = async () => {
    try {
      const response = await remove();
      showToast(response.status, response.message);
    } catch (error) {
      handleError(error, "Échec de la suppression de la vente avec avance");
    }
  };

  return (
    <DeleteConfirmationDialog
      trigger={trigger}
      title={`Supprimer la vente avec avance "${advanceSale.sale.reference}"`}
      description={`Êtes-vous sûr de vouloir supprimer la vente avec avance "${advanceSale.sale.reference}"`}
      isDeleting={isDeleting}
      onConfirm={handleDelete}
    />
  );
}
