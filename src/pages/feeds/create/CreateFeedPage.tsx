
import { useState } from "react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "@/utils/showToast";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/types/error.type";
import CustomDialog from "@/components/common/CustomDialog";
import AddButton from "@/components/common/AddButton";
import z from "zod";
import { createFeedSchema } from "@/schemas/feeds/feed.schema";
import { CreateFeedDTO } from "@/dto/feed.dto";
import { feedsApi } from "@/api/feeds.api";

export function CreateFeedDialog({ onCreate }: { onCreate?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof createFeedSchema>>({
    resolver: zodResolver(createFeedSchema),
    defaultValues: {
      url: "",
      title: "",
      description: "",
      active: true,
      tags: [], // optional array of tag IDs if applicable
    },
  });

  const onSubmit = async (values: CreateFeedDTO) => {
    setIsSubmitting(true);
    try {
      const response = await feedsApi.create(values);
      showToast(response.status, response.message);
      setIsOpen(false);
      form.reset();
      onCreate?.();
    } catch (err) {
      const error = err as AxiosError;
      showToast(
        "error",
        (error.response?.data as ApiErrorResponse).message || "Failed to create feed"
      );
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomDialog
      trigger={<AddButton label="Add Feed" />}
      title="Create New Feed"
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
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </CustomDialog>
  );
}

export default CreateFeedDialog;
