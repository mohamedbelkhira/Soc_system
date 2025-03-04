import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import CustomDialog from '@/components/common/CustomDialog';
import { FeedResponse } from '@/dto/feed.dto';
import { Trash2 } from 'lucide-react';
import { useDeleteFeed } from '@/swr/feeds.swr';

interface DeleteFeedDialogProps {
  feed: FeedResponse;
}

const DeleteFeedDialog: React.FC<DeleteFeedDialogProps> = ({ feed }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { deleteFeed, isDeleting } = useDeleteFeed();

  const handleDelete = async () => {
    await deleteFeed(feed.feedId);
    setIsOpen(false);
  };

  return (
    <CustomDialog
      trigger={
        <Button variant="ghost" size="icon">
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      }
      title={`Supprimer le flux "${feed.title || feed.url}"`}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <p>
        Êtes-vous sûr de vouloir supprimer le flux{" "}
        <span className="font-semibold">{feed.title || feed.url}</span> ? Cette action est
        irréversible.
      </p>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isDeleting}>
          Annuler
        </Button>
        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? "Suppression..." : "Supprimer"}
        </Button>
      </div>
    </CustomDialog>
  );
};

export default DeleteFeedDialog;