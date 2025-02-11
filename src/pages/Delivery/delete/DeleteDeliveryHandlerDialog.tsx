// src/components/DeleteDeliveryHandlerDialog.tsx

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import CustomDialog from "@/components/common/CustomDialog";
import { deliveryHandlersApi } from '@/api/deliveryHandler.api';
import { DeliveryHandler } from '@/types/deliveryHandler.dto';
import { showToast } from '@/utils/showToast';
import { AxiosError } from 'axios';
import { ApiErrorResponse } from '@/types/error.type';
import { Trash2 } from 'lucide-react';

interface DeleteDeliveryHandlerDialogProps {
  deliveryHandler: DeliveryHandler;
  onDelete: () => void;
}

const DeleteDeliveryHandlerDialog: React.FC<DeleteDeliveryHandlerDialogProps> = ({ deliveryHandler, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await deliveryHandlersApi.delete(deliveryHandler.id);
      showToast(response.status, response.message);
      setIsOpen(false);
      onDelete();
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      showToast(
        'error',
        error.response?.data.message ?? 'Échec de la suppression du Livreur'
      );
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Construct the dynamic message based on the type
  const deleteMessage = deliveryHandler.type === 'EMPLOYEE'
    ? `Êtes-vous sûr de vouloir supprimer le livreur "${deliveryHandler.employee?.firstName} ${deliveryHandler.employee?.lastName}" ? Cette action est irréversible.`
    : `Êtes-vous sûr de vouloir supprimer l'agence de livraison "${deliveryHandler.agency?.name}" ? Cette action est irréversible.`;

  // Optionally, make the title dynamic as well
  const dialogTitle = deliveryHandler.type === 'EMPLOYEE'
    ? `Supprimer le livreur "${deliveryHandler.employee?.firstName} ${deliveryHandler.employee?.lastName}"`
    : `Supprimer l'agence de livraison "${deliveryHandler.agency?.name}"`;

  return (
    <CustomDialog
      trigger={
        <Button variant="ghost" size="icon" disabled={isDeleting}>
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      }
      title={dialogTitle} // Use dynamic title
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <p>
        {deleteMessage}
      </p>
      <div className="flex justify-end gap-2 mt-4">
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
          {isDeleting ? 'Suppression...' : 'Supprimer'}
        </Button>
      </div>
    </CustomDialog>
  );
};

export default DeleteDeliveryHandlerDialog;
