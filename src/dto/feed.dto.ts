import { z } from 'zod';
import { createFeedSchema, updateFeedSchema, deleteFeedSchema } from '@/schemas/feeds/feed.schema';

export type CreateFeedDTO = z.infer<typeof createFeedSchema>;
export type UpdateFeedDTO = z.infer<typeof updateFeedSchema>;
export type DeleteFeedDTO = z.infer<typeof deleteFeedSchema>;

export interface FeedResponse {
  feedId: string;
  url: string;
  title?: string | null;
  description?: string | null;
  active: boolean;
  lastChecked?: string | null;
  createdAt: string;
  updatedAt: string;
  // Assuming you want to include tag information in the response:
  tags: TagResponse[];
}

export interface TagResponse {
  tagId: string;
  name: string;
  color?: string | null;
}
