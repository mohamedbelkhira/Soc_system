import { z } from "zod";

export const createFeedSchema = z.object({
  url: z.string().url("Invalid URL"),
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional(),
  active: z.boolean().optional(),
  tags: z.array(z.string().uuid("Invalid Tag ID")).optional(),
});

export const updateFeedSchema = z.object({
  feedId: z.string().uuid("Invalid Feed ID"),
  url: z.string().url("Invalid URL").optional(),
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional(),
  active: z.boolean().optional(),
  tags: z.array(z.string().uuid("Invalid Tag ID")).optional(),
});

export const deleteFeedSchema = z.object({
  feedId: z.string().uuid("Invalid Feed ID"),
});
