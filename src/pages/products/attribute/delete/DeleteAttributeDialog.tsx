import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog";
import { useDeleteAttribute } from "@/swr/products/attribute.swr";
import { Attribute } from "@/types/attribute.dto";
import handleError from "@/utils/handleError";
import { showToast } from "@/utils/showToast";

export default function DeleteAttributeDialog({
  attribute,
}: {
  attribute: Attribute;
}) {
  const {
    delete: deleteAttribute,
    isDeleting,
    error,
  } = useDeleteAttribute(attribute.id);

  const handleDelete = async () => {
    try {
      const response = await deleteAttribute();
      if (error) {
        handleError(error, "Échec de la suppression de l'attribut");
      } else {
        showToast(response.status, response.message);
      }
    } catch (error) {
      handleError(error, "Échec de la suppression de l'attribut");
    }
  };

  return (
    <DeleteConfirmationDialog
      title={`Supprimer l'attribut "${attribute.name}"`}
      description={`Êtes-vous sûr de vouloir supprimer ce attribut?`}
      isDeleting={isDeleting}
      onConfirm={handleDelete}
    />
  );
}
