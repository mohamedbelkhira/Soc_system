import React from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CircleAlert } from 'lucide-react';
import { DialogProps } from '@radix-ui/react-dialog';

interface DeleteDialogProps extends Omit<DialogProps, 'onOpenChange'> {
  onClose: () => void;
  onDelete: () => void;
  title: string;
  description: string;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  open,
  onClose,
  onDelete,
  title,
  description,
}) => {
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[420px] bg-background text-foreground">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <CircleAlert className="h-6 w-6 text-destructive" />
            <span>{title}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 text-muted-foreground">
          {description}
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;