import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog";
import DeleteAction from "@/components/common/actions/DeleteAction";
import { useDeleteClient } from "@/swr/client/client.swr";
import { Client } from "@/types/clients/client.dto";
import handleError from "@/utils/handleError";
import { showToast } from "@/utils/showToast";

export default function DeleteClientDialog({ client }: { client: Client }) {
  const {
    delete: deleteAttribute,
    isDeleting,
    error,
  } = useDeleteClient(client.id);

  const handleDelete = async () => {
    try {
      const response = await deleteAttribute();
      if (error) {
        handleError(error, "Échec de la suppression du client");
      } else {
        showToast(response.status, response.message);
      }
    } catch (error) {
      handleError(error, "Échec de la suppression du client");
    }
  };

  return (
    <DeleteConfirmationDialog
      trigger={<DeleteAction />}
      title={`Supprimer le client "${client.firstName} ${client.lastName}"`}
      description={`Êtes-vous sûr de vouloir supprimer ce client?`}
      isDeleting={isDeleting}
      onConfirm={handleDelete}
    />
  );
}
