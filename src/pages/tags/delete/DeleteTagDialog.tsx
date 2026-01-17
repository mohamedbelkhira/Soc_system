import { useState } from 'react';
import { Button } from '@/components/ui/button';
import CustomDialog from '@/components/common/CustomDialog';
import { TagResponse } from '@/dto/tag.dto';
import { useDeleteTag } from '@/swr/tags.swr';
import { Trash2, AlertTriangle } from 'lucide-react';

interface DeleteTagDialogProps {
    tag: TagResponse;
    onSuccess?: () => void;
}

export function DeleteTagDialog({ tag, onSuccess }: DeleteTagDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { deleteTag } = useDeleteTag();

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteTag(tag.tagId);
            setIsOpen(false);
            onSuccess?.();
        } catch (error) {
            console.error('Failed to delete tag:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <CustomDialog
            trigger={
                <Button variant="outline" size="sm" className="gap-1 text-destructive hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-3 w-3" />
                    Supprimer
                </Button>
            }
            title="Supprimer le tag"
            isOpen={isOpen}
            onOpenChange={setIsOpen}
        >
            <div className="space-y-6">
                {/* Warning Icon */}
                <div className="flex justify-center">
                    <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                        <AlertTriangle className="h-6 w-6 text-destructive" />
                    </div>
                </div>

                {/* Tag Preview */}
                <div className="text-center space-y-2">
                    <p className="text-foreground">
                        Êtes-vous sûr de vouloir supprimer ce tag ?
                    </p>
                    <div className="flex justify-center">
                        <div
                            className="inline-flex px-3 py-1.5 rounded-md text-sm font-medium border"
                            style={{
                                backgroundColor: tag.color ? `${tag.color}20` : undefined,
                                color: tag.color || undefined,
                                borderColor: tag.color ? `${tag.color}40` : undefined,
                            }}
                        >
                            {tag.name}
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Cette action supprimera également les associations avec les flux et articles.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        disabled={isDeleting}
                    >
                        Annuler
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Suppression...' : 'Supprimer'}
                    </Button>
                </div>
            </div>
        </CustomDialog>
    );
}

export default DeleteTagDialog;
