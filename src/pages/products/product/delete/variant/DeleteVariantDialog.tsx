import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog";
import { useDeleteVariant } from "@/swr/products/variant.swr";
import { Variant } from "@/types/variant.dto";
import getVariantName from "@/utils/getVariantName";
import handleError from "@/utils/handleError";
import { showToast } from "@/utils/showToast";

export default function DeleteVariantDialog({ variant }: { variant: Variant }) {
  const {
    delete: remove,
    isDeleting,
    error,
  } = useDeleteVariant(variant.id, variant.productId);

  const handleDelete = async () => {
    try {
      const response = await remove();
      if (error) {
        handleError(error, "Échec de la suppression de la variante");
      } else {
        showToast(response.status, response.message);
      }
    } catch (error) {
      handleError(error, "Échec de la suppression de la variante");
    }
  };
  const variantName = getVariantName(variant);

  return (
    <DeleteConfirmationDialog
      title={`Supprimer la variante "${variantName}"`}
      description={`Êtes-vous sûr de vouloir supprimer la variante ${variantName}`}
      isDeleting={isDeleting}
      onConfirm={handleDelete}
    />
  );
}
