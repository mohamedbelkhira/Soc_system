import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog";
import { useDeleteStoreSale } from "@/swr/sales/store-sale.swr";
import { StoreSale } from "@/types/sales/store-sale.dto";
import handleError from "@/utils/handleError";
import { showToast } from "@/utils/showToast";

export default function DeleteStoreSaleDialog({
  storeSale,
  trigger,
}: {
  storeSale: StoreSale;
  trigger: ReactNode;
}) {
  const navigate = useNavigate();
  const { delete: remove, isDeleting } = useDeleteStoreSale(storeSale.id);

  const handleDelete = async () => {
    try {
      const response = await remove();
      showToast(response.status, response.message);
      navigate(`/store-sales`);
    } catch (error) {
      handleError(error, "Échec de la suppression de la vente en magasin");
    }
  };

  return (
    <DeleteConfirmationDialog
      trigger={trigger}
      title={`Supprimer la vente en magasin "${storeSale.sale.reference}"`}
      description={`Êtes-vous sûr de vouloir supprimer la vente en magasin "${storeSale.sale.reference}"`}
      isDeleting={isDeleting}
      onConfirm={handleDelete}
    />
  );
}
