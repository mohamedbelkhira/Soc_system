import { ReactNode } from "react";

import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog";
import { useDeleteProduct } from "@/swr/products/product.swr";
import { Product } from "@/types/product.dto";
import handleError from "@/utils/handleError";
import { showToast } from "@/utils/showToast";

export default function DeleteProductDialog({
  product,
  trigger,
}: {
  product: Product;
  trigger: ReactNode;
}) {
  const { delete: remove, isDeleting, error } = useDeleteProduct(product.id);

  const handleDelete = async () => {
    try {
      const response = await remove();
      if (error) {
        handleError(error, "Échec de la suppression du produit");
      } else {
        showToast(response.status, response.message);
      }
    } catch (error) {
      handleError(error, "Échec de la suppression du produit");
    }
  };

  return (
    <DeleteConfirmationDialog
      trigger={trigger}
      title={`Supprimer le produit "${product.name}"`}
      description={`Êtes-vous sûr de vouloir supprimer le produit ${product.name}`}
      isDeleting={isDeleting}
      onConfirm={handleDelete}
    />
  );
}
