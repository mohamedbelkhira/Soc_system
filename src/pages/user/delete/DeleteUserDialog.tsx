// src/pages/users/delete/DeleteUserDialog.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import CustomDialog from '@/components/common/CustomDialog';
import { usersApi } from '@/api/user.api';
import { UserResponse } from '@/dto/user.dto';
import { showToast } from '@/utils/showToast';
import { AxiosError } from 'axios';
import { ApiErrorResponse } from '@/types/error.type';
import { Trash2 } from 'lucide-react';

interface DeleteUserDialogProps {
  user: UserResponse;
  onDelete: () => void;
}

const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({ user, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await usersApi.delete(user.id);
      showToast(response.status, response.message);
      setIsOpen(false);
      onDelete();
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      showToast("error", error.response?.data.message ?? "Failed to delete user");
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
      title={`Delete User "${user.username}"`}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <p>
        Are you sure you want to delete user{" "}
        <span className="font-semibold">{user.username}</span>? This action is irreversible.
      </p>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isDeleting}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </CustomDialog>
  );
};

export default DeleteUserDialog;
