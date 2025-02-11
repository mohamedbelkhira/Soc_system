
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import CustomDialog from '@/components/common/CustomDialog';
import { employeesApi } from '@/api/employees.api';
import { Employee } from '@/types/employee.dto';
import { showToast } from '@/utils/showToast';
import { AxiosError } from 'axios';
import { ApiErrorResponse } from '@/types/error.type';
import { Trash2 } from 'lucide-react';

interface DeleteEmployeeDialogProps {
  employee: Employee;
  onDelete: () => void;
}

const DeleteEmployeeDialog: React.FC<DeleteEmployeeDialogProps> = ({ employee, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await employeesApi.delete(employee.id);
      showToast(response.status, response.message);
      setIsOpen(false);
      onDelete();
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      showToast(
        'error',
        error.response?.data.message ?? 'Échec de la suppression de l\'employé'
      );
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <CustomDialog
      trigger={
        <Button variant="ghost" size="icon">
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      }
      title={`Supprimer l'employé "${employee.firstName} ${employee.lastName}"`}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <p>
        Êtes-vous sûr de vouloir supprimer l'employé{' '}
        <span className="font-semibold">{employee.firstName} {employee.lastName}</span> ? Cette action est irréversible.
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

export default DeleteEmployeeDialog;