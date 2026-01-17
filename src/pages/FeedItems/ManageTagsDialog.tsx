import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import TagsMultiSelect from '@/components/common/TagsMultiSelect';
import { FeedItemResponse } from '@/dto/feedItem.dto';
import { feedItemsApi } from '@/api/feedItems.api';
import { showToast } from '@/utils/showToast';
import { useIsMobile } from '@/hooks/use-mobile';

interface ManageTagsDialogProps {
    item: FeedItemResponse;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onTagsUpdated?: (updatedItem: FeedItemResponse) => void;
}

export default function ManageTagsDialog({
    item,
    isOpen,
    onOpenChange,
    onTagsUpdated,
}: ManageTagsDialogProps) {
    // Initialize with current tag IDs
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const isMobile = useIsMobile();
    const width = window.innerWidth - 2 * 16;

    // Reset selection when dialog opens with new item or item changes
    useEffect(() => {
        if (isOpen) {
            setSelectedTagIds(item.tags?.map((tag) => tag.tagId) || []);
        }
    }, [isOpen, item.itemId]);

    const handleSave = async () => {
        setIsUpdating(true);
        try {
            const response = await feedItemsApi.update(item.itemId, {
                tags: selectedTagIds,
            });

            if (response.status === 'success') {
                showToast('success', 'Tags updated successfully');
                onTagsUpdated?.(response.data);
                onOpenChange(false);
            }
        } catch (error) {
            console.error('Failed to update tags:', error);
            showToast('error', 'Failed to update tags');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent style={isMobile ? { width: width } : { minWidth: 500 }}>
                <DialogHeader className="px-6 py-4 bg-muted text-foreground">
                    <DialogTitle>Gérer les tags</DialogTitle>
                </DialogHeader>
                <div className="px-6 pb-5 text-foreground">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {item.title || 'Article sans titre'}
                    </p>

                    <TagsMultiSelect
                        value={selectedTagIds}
                        onChange={setSelectedTagIds}
                        placeholder="Select tags..."
                    />

                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isUpdating}
                        >
                            Annuler
                        </Button>
                        <Button onClick={handleSave} disabled={isUpdating}>
                            {isUpdating ? 'Sauvegarde...' : 'Sauvegarder'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
