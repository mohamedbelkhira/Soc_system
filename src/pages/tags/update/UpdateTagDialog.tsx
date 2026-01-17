import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CustomDialog from '@/components/common/CustomDialog';
import { TagResponse, UpdateTagDTO } from '@/dto/tag.dto';
import { updateTagSchema, UpdateTagFormValues } from '@/schemas/tag.schema';
import { useUpdateTag } from '@/swr/tags.swr';
import ColorPicker from '@/components/common/ColorPicker';
import { Pencil, Tag } from 'lucide-react';

interface UpdateTagDialogProps {
    tag: TagResponse;
    onSuccess?: () => void;
}

export function UpdateTagDialog({ tag, onSuccess }: UpdateTagDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { updateTag } = useUpdateTag();

    const form = useForm<UpdateTagFormValues>({
        resolver: zodResolver(updateTagSchema),
        defaultValues: {
            name: tag.name,
            color: tag.color || '#22C55E',
        },
    });

    const onSubmit = async (values: UpdateTagFormValues) => {
        setIsSubmitting(true);
        try {
            const tagData: UpdateTagDTO = {
                name: values.name,
                color: values.color,
            };
            await updateTag(tag.tagId, tagData);
            setIsOpen(false);
            onSuccess?.();
        } catch (error) {
            console.error('Failed to update tag:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setIsOpen(false);
        form.reset({
            name: tag.name,
            color: tag.color || '#22C55E',
        });
    };

    return (
        <CustomDialog
            trigger={
                <Button variant="outline" size="sm" className="gap-1">
                    <Pencil className="h-3 w-3" />
                    Modifier
                </Button>
            }
            title="Modifier le tag"
            isOpen={isOpen}
            onOpenChange={(open) => {
                setIsOpen(open);
                if (open) {
                    form.reset({
                        name: tag.name,
                        color: tag.color || '#22C55E',
                    });
                }
            }}
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Preview */}
                    <div className="flex items-center justify-center p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Tag className="h-5 w-5 text-muted-foreground" />
                            <div
                                className="px-3 py-1.5 rounded-md text-sm font-medium border transition-all duration-200"
                                style={{
                                    backgroundColor: `${form.watch('color') || '#22C55E'}20`,
                                    color: form.watch('color') || '#22C55E',
                                    borderColor: `${form.watch('color') || '#22C55E'}40`,
                                }}
                            >
                                {form.watch('name') || 'Aperçu du tag'}
                            </div>
                        </div>
                    </div>

                    {/* Tag Name */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nom du tag</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ex: CVE, Ransomware, Phishing..."
                                        {...field}
                                        autoComplete="off"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Color Picker */}
                    <FormField
                        control={form.control}
                        name="color"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Couleur</FormLabel>
                                <FormControl>
                                    <ColorPicker
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                        >
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Mise à jour...' : 'Enregistrer'}
                        </Button>
                    </div>
                </form>
            </Form>
        </CustomDialog>
    );
}

export default UpdateTagDialog;
