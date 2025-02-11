// src/components/update/UpdateFeedDialog.tsx
import { useEffect, useState } from "react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "@/utils/showToast";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/types/error.type";
import CustomDialog from "@/components/common/CustomDialog";
import { UpdateFeedDTO } from "@/dto/feed.dto";
import { updateFeedSchema } from "@/schemas/feeds/feed.schema";
import { feedsApi } from "@/api/feeds.api";
import UpdateAction from "@/components/common/actions/UpdateAction";
import { Feed } from "@/dto/feed.dto";

export function UpdateFeedDialog({
  feed,
  onUpdate,
}: {
  feed: Feed;
  onUpdate?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Reset form values when the dialog opens
  useEffect(() => {
    if (isOpen) {
      form.reset({
        feedId: feed.feedId,
        url: feed.url,
        title: feed.title || "",
        description: feed.description || "",
        active: feed.active,
        tags: feed.tags ? feed.tags.map(tag => tag.tagId) : [],
      });
    }
  }, [isOpen, feed, form]);

  const onSubmit = async (values: UpdateFeedDTO) => {
    setIsSubmitting(true);
    try {
      const response = await feedsApi.update(feed.feedId, values);
      showToast(response.status, response.message);
      setIsOpen(false);
      onUpdate?.();
    } catch (err) {
      const error = err as AxiosError;
      showToast(
        "error",
        (error.response?.data as ApiErrorResponse).message || "Failed to update feed"
      );
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomDialog
      trigger={<UpdateAction />}
      title="Update Feed"
      isOpen={isOpen}
      onOpenChange={setIsOpen}
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
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </Form>
    </CustomDialog>
  );
}

export default UpdateFeedDialog;
