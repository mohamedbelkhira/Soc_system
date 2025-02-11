import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog";
import { useDeleteCategory } from "@/swr/products/category.swr";
import { Category } from "@/types/category.dto";
import handleError from "@/utils/handleError";
import { showToast } from "@/utils/showToast";

export default function DeleteCategoryDialog({
  category,
}: {
  category: Category;
}) {
  const { delete: remove, isDeleting, error } = useDeleteCategory(category.id);
  const handleDelete = async () => {
    try {
      const response = await remove();
      if (error) {
        handleError(error, "Échec de la suppression de la catégorie");
      } else {
        showToast(response.status, response.message);
      }
    } catch (error) {
      handleError(error, "Échec de la suppression de la catégorie");
    }
  };

  return (
    <DeleteConfirmationDialog
      title={`Supprimer la catégorie "${category.name}"`}
      description={`Êtes-vous sûr de vouloir supprimer la catégorie "${category.name}"`}
      isDeleting={isDeleting}
      onConfirm={handleDelete}
    />
  );
}
