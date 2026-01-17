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
import { CreateTagDTO } from '@/dto/tag.dto';
import { createTagSchema, CreateTagFormValues } from '@/schemas/tag.schema';
import { useCreateTag } from '@/swr/tags.swr';
import ColorPicker from '@/components/common/ColorPicker';
import { Plus, Tag } from 'lucide-react';

interface CreateTagDialogProps {
    onSuccess?: () => void;
}

export function CreateTagDialog({ onSuccess }: CreateTagDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { createTag } = useCreateTag();

    const form = useForm<CreateTagFormValues>({
        resolver: zodResolver(createTagSchema),
        defaultValues: {
            name: '',
            color: '#22C55E',
        },
    });

    const onSubmit = async (values: CreateTagFormValues) => {
        setIsSubmitting(true);
        try {
            const tagData: CreateTagDTO = {
                name: values.name,
                color: values.color,
            };
            await createTag(tagData);
            setIsOpen(false);
            form.reset();
            onSuccess?.();
        } catch (error) {
            console.error('Failed to create tag:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setIsOpen(false);
        form.reset();
    };

    return (
        <CustomDialog
            trigger={
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Créer un tag
                </Button>
            }
            title="Créer un nouveau tag"
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            onOpenAutoFocus={() => {
                form.reset({
                    name: '',
                    color: '#22C55E',
                });
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
                            {isSubmitting ? 'Création...' : 'Créer le tag'}
                        </Button>
                    </div>
                </form>
            </Form>
        </CustomDialog>
    );
}

export default CreateTagDialog;
