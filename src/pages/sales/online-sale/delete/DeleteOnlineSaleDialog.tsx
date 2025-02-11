import { ReactNode } from "react";

import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog";
import { useDeleteOnlineSale } from "@/swr/sales/online-sale.swr";
import { OnlineSale } from "@/types/sales/online-sale.dto";
import handleError from "@/utils/handleError";
import { showToast } from "@/utils/showToast";

export default function DeleteOnlineSaleDialog({
  onlineSale,
  trigger,
}: {
  onlineSale: OnlineSale;
  trigger: ReactNode;
}) {
  const { delete: remove, isDeleting } = useDeleteOnlineSale(onlineSale.id);

  const handleDelete = async () => {
    try {
      const response = await remove();
      showToast(response.status, response.message);
    } catch (error) {
      handleError(error, "Échec de la suppression de la vente en ligne");
    }
  };

  return (
    <DeleteConfirmationDialog
      trigger={trigger}
      title={`Supprimer la vente en ligne "${onlineSale.sale.reference}"`}
      description={`Êtes-vous sûr de vouloir supprimer la vente en ligne "${onlineSale.sale.reference}"`}
      isDeleting={isDeleting}
      onConfirm={handleDelete}
    />
  );
}
