import React, { useState } from 'react';
import DeleteDialog from '@/components/common/-DeleteDialog';
import { Button } from '@/components/ui/button';

const CommonComponentsPage: React.FC = () => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteDialogOpen = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteAction = () => {
    // Handle delete action logic here
    console.log('Item deleted');
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Common Components Showcase</h1>
      <div className="mb-6">
      <Button onClick={handleDeleteDialogOpen}>
          Open Delete Dialog
      </Button>
        
      </div>
      <DeleteDialog
        open={isDeleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onDelete={handleDeleteAction}
        title="Delete Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
      />
    </div>
  );
};

export default CommonComponentsPage;
