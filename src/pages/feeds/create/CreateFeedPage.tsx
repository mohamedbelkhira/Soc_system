import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import CustomDialog from "@/components/common/CustomDialog";
import { CreateFeedDTO } from "@/dto/feed.dto";
import { createFeedSchema } from "@/schemas/feeds/feed.schema";
import { useCreateFeed } from "@/swr/feeds.swr";

export function CreateFeedDialog() {
  const { createFeed, isCreating } = useCreateFeed();

  const form = useForm<CreateFeedDTO>({
    resolver: zodResolver(createFeedSchema),
    defaultValues: {
      url: "",
      title: "",
      description: "",
      active: true,
      tags: [],
    },
  });

  const onSubmit = async (values: CreateFeedDTO) => {
    await createFeed(values);
    form.reset(); // Reset form after successful creation
  };

  return (
    <CustomDialog
      trigger={<Button>Créer un flux</Button>}
      title="Créer un nouveau flux"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Feed URL */}
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Feed URL</FormLabel>
                <FormControl>
                  <Input placeholder="Enter feed URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter feed title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter feed description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Active Switch */}
          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between p-3">
                <div className="space-y-0.5">
                  <FormLabel>Active</FormLabel>
                  <FormMessage />
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </CustomDialog>
  );
}

export default CreateFeedDialog;