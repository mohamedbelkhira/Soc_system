import { useState } from "react";
import CustomDialog from "@/components/common/CustomDialog";
import { Button } from "@/components/ui/button";
import { showToast } from "@/utils/showToast";
import { SaleItem } from "@/types/sales/sale-Item.dto";
import DeleteAction from "@/components/common/actions/DeleteAction";

export default function DeleteSaleItemDialog({
  saleItem,
  onDelete,
}: {
  saleItem: SaleItem;
  onDelete: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      onDelete();
      showToast("success", "Article en vente supprimé avec succès");
      setIsOpen(false);
    } catch {
      showToast("error", "Échec de la suppression de la catégorie");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <CustomDialog
      trigger={<DeleteAction />}
      title={`Supprimer l'article "${saleItem.variantName}"`}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <div className="space-y-4">
        <p>
          Êtes-vous sûr de vouloir supprimer l'article{" "}
          <span className="font-semibold">{saleItem.variantName}</span>
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
