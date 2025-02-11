
import { useEffect, useState } from 'react';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateJobSchema } from '@/schemas/job.schema';
import { UpdateJobDTO, Job } from '@/types/job.dto';
import { showToast } from '@/utils/showToast';
import { AxiosError } from 'axios';
import { ApiErrorResponse } from '@/types/error.type';
import CustomDialog from '@/components/common/CustomDialog';
import { Edit3 } from 'lucide-react';
import { jobsApi } from '@/api/jobs.api';

interface UpdateJobDialogProps {
  job: Job;
  onUpdate?: () => void;
}

const UpdateJobDialog: React.FC<UpdateJobDialogProps> = ({ job, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UpdateJobDTO>({
    resolver: zodResolver(updateJobSchema),
    defaultValues: {
      id: job.id,
      name: job.name,
      description: job.description,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        id: job.id,
        name: job.name,
        description: job.description,
      });
    }
  }, [isOpen, job, form]);

  const onSubmit = async (values: UpdateJobDTO) => {
    setIsSubmitting(true);
    try {
      const response = await jobsApi.update(job.id, values);

      showToast(response.status, response.message);
      setIsOpen(false);
      onUpdate?.();
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      showToast(
        'error',
        error.response?.data.message ?? 'Erreur lors de la mise à jour du Poste'
      );
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomDialog
      trigger={
        <Button variant="ghost" size="icon">
          <Edit3 className="h-4 w-4 text-primary" />
        </Button>
      }
      title={`Modifier le Poste "${job.name}"`}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-foreground">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom du poste</FormLabel>
                <FormControl>
                  <Input placeholder="Entrer le Nom" {...field} />
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
                  <Input placeholder="Entrer une description" {...field} />
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
              {isSubmitting ? 'Mise à jour...' : 'Mettre à jour'}
            </Button>
          </div>
        </form>
      </Form>
    </CustomDialog>
  );
};

export default UpdateJobDialog;