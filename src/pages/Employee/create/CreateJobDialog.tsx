import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { jobsApi } from '@/api/jobs.api';
import { CreateJobDTO } from '@/types/job.dto';
import { showToast } from '@/utils/showToast';
import { AxiosError } from 'axios';
import { ApiErrorResponse } from '@/types/error.type';
import AddButton from '@/components/common/AddButton';
import CustomDialog from '@/components/common/CustomDialog';
import { createJobSchema } from '@/schemas/job.schema';

interface CreateJobDialogProps {
  onAdd: () => void;
}

export function CreateJobDialog({ onAdd }: CreateJobDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateJobDTO>({
    resolver: zodResolver(createJobSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const handleSubmit = async (values: CreateJobDTO) => {
    setIsSubmitting(true);
    try {
      const response = await jobsApi.create(values);
      showToast(response.status, response.message);
      setIsOpen(false);
      form.reset();
      onAdd(); // Call this to trigger the parent refresh
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      showToast(
        'error',
        error.response?.data.message ?? 'Échec de la création du poste'
      );
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomDialog
      trigger={<AddButton label="Ajouter un Poste" />}
      title="Créer un nouveau poste"
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 text-foreground">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom du post</FormLabel>
                <FormControl>
                  <Input placeholder="Saisir le nom du post" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Saisir la description du post"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Création...' : 'Créer'}
            </Button>
          </div>
        </form>
      </Form>
    </CustomDialog>
  );
}

export default CreateJobDialog;