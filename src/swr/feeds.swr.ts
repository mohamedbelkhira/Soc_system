import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { feedsApi } from '@/api/feeds.api';
import { FeedResponse, CreateFeedDTO, UpdateFeedDTO } from '@/dto/feed.dto';
import { showToast } from '@/utils/showToast';

// Fetch all feeds
export function useFeeds() {
  const { data, error, isLoading, mutate } = useSWR<FeedResponse[]>(
    'feeds',
    async () => {
      try {
        const response = await feedsApi.getAll();
        return response.data;
      } catch (err) {
        showToast('error', 'Failed to fetch feeds');
        throw err;
      }
    }
  );

  return {
    feeds: data || [],
    isLoading,
    error,
    mutate
  };
}

// Fetch a single feed by ID
export function useFeed(id: string) {
  const { data, error, isLoading, mutate } = useSWR<FeedResponse>(
    id ? `feeds/${id}` : null,
    async () => {
      try {
        const response = await feedsApi.getById(id);
        return response.data;
      } catch (err) {
        showToast('error', 'Failed to fetch feed');
        throw err;
      }
    }
  );

  return {
    feed: data,
    isLoading,
    error,
    mutate
  };
}

// Create a new feed
export function useCreateFeed() {
  const { trigger, isMutating } = useSWRMutation(
    'feeds',
    async (_, { arg }: { arg: CreateFeedDTO }) => {
      try {
        const response = await feedsApi.create(arg);
        showToast('success', response.message || 'Feed created successfully');
        return response.data;
      } catch (err) {
        showToast('error', 'Failed to create feed');
        throw err;
      }
    }
  );

  return {
    createFeed: trigger,
    isCreating: isMutating
  };
}

// Update an existing feed
export function useUpdateFeed() {
  const { trigger, isMutating } = useSWRMutation(
    'feeds',
    async (_, { arg }: { arg: { id: string; data: UpdateFeedDTO } }) => {
      try {
        const response = await feedsApi.update(arg.id, arg.data);
        showToast('success', response.message || 'Feed updated successfully');
        return response.data;
      } catch (err) {
        showToast('error', 'Failed to update feed');
        throw err;
      }
    }
  );

  return {
    updateFeed: trigger,
    isUpdating: isMutating
  };
}

// Delete a feed
export function useDeleteFeed() {
  const { trigger, isMutating } = useSWRMutation(
    'feeds',
    async (_, { arg }: { arg: string }) => {
      try {
        const response = await feedsApi.delete(arg);
        showToast('success', response.message || 'Feed deleted successfully');
        return response.data;
      } catch (err) {
        showToast('error', 'Failed to delete feed');
        throw err;
      }
    }
  );

  return {
    deleteFeed: trigger,
    isDeleting: isMutating
  };
}