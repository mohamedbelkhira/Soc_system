// src/components/jobs/delete/DeleteJobDialog.tsx

import { useState } from 'react';
import CustomDialog from '@/components/common/CustomDialog';
import { Button } from '@/components/ui/button';
import { Job } from '@/types/job.dto';
import { Trash2 } from 'lucide-react';
import { showToast } from '@/utils/showToast';
import { AxiosError } from 'axios';
import { ApiErrorResponse } from '@/types/error.type';
import { jobsApi } from '@/api/jobs.api';

interface DeleteJobDialogProps {
  job: Job;
  onDelete?: () => void;
}

const DeleteJobDialog: React.FC<DeleteJobDialogProps> = ({ job, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await jobsApi.delete(job.id);

      showToast(response.status, response.message);
      setIsOpen(false);
      onDelete?.();
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      showToast(
        'error',
        error.response?.data.message ?? 'Failed to delete the job'
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
      title={`Delete Job "${job.name}"`}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <p>
        Are you sure you want to delete the job <strong>{job.name}</strong>? This
        action is irreversible.
      </p>
      <div className="flex justify-end gap-2 mt-6">
        <Button
          variant="outline"
          onClick={() => setIsOpen(false)}
          disabled={isDeleting}
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
    </CustomDialog>
  );
};

export default DeleteJobDialog;
