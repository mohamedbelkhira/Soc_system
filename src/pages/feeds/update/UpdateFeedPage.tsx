import { useState } from "react";
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
import { UpdateFeedDTO } from "@/dto/feed.dto";
import { updateFeedSchema } from "@/schemas/feeds/feed.schema";
import { FeedResponse } from "@/dto/feed.dto";
import UpdateAction from "@/components/common/actions/UpdateAction";
import { useUpdateFeed } from "@/swr/feeds.swr";
import { showToast } from "@/utils/showToast";

export function UpdateFeedDialog({
  feed,
}: {
  feed: FeedResponse;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { updateFeed, isUpdating } = useUpdateFeed();

  const form = useForm<UpdateFeedDTO>({
    resolver: zodResolver(updateFeedSchema),
    defaultValues: {
      feedId: feed.feedId,
      url: feed.url,
      title: feed.title || "",
      description: feed.description || "",
      active: feed.active,
      tags: feed.tags ? feed.tags.map(tag => tag.tagId) : [],
    },
  });

  const onSubmit = async (values: UpdateFeedDTO) => {
    try {
      await updateFeed({ id: feed.feedId, data: values });
      setIsOpen(false); // Close the dialog on successful update
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showToast('error', 'Failed to update feed');
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    form.reset(); // Reset the form to initial values
  };

  return (
    <CustomDialog
      trigger={<UpdateAction />}
      title="Update Feed"
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      onOpenAutoFocus={() => {
        form.reset({
          feedId: feed.feedId,
          url: feed.url,
          title: feed.title || "",
          description: feed.description || "",
          active: feed.active,
          tags: feed.tags ? feed.tags.map(tag => tag.tagId) : [],
        });
      }}
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

        
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </Form>
    </CustomDialog>
  );
}

export default UpdateFeedDialog;