import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import CustomDialog from '@/components/common/CustomDialog';
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
import { Loader2, Settings } from 'lucide-react';
import { WorkerConfigResponse } from '@/dto/workerConfig.dto';

const formSchema = z.object({
    pollInterval: z.coerce.number().min(10, "Poll interval must be at least 10 seconds").max(3600, "Max value is 3600 seconds"),
});

interface EditWorkerConfigDialogProps {
    config: WorkerConfigResponse;
    onUpdate: (id: string, interval: number) => Promise<void>;
}

export function EditWorkerConfigDialog({ config, onUpdate }: EditWorkerConfigDialogProps) {
    const [open, setOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            pollInterval: config.pollInterval,
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await onUpdate(config.configId, values.pollInterval);
            setOpen(false);
        } catch (error) {
            console.error('Failed to update config:', error);
        }
    };

    return (
        <CustomDialog
            title="Worker Configuration"
            trigger={
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Settings className="h-4 w-4" />
                </Button>
            }
            isOpen={open}
            onOpenChange={setOpen}
        >
            <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    Adjust how often the worker checks for new feeds.
                </p>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="pollInterval"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Poll Interval (seconds)</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </CustomDialog>
    );
}
