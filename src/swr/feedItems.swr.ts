import useSWR from 'swr';
import { useCallback, useMemo } from 'react';
import { feedItemsApi } from '@/api/feedItems.api';
import { FeedItemResponse } from '@/dto/feedItem.dto';
import { PaginatedResponse } from '@/types/pagination.type';

const FEED_ITEMS_KEY = "feed-items";
const getPaginatedFeedItemsKey = (params: URLSearchParams) => {
  return `${FEED_ITEMS_KEY}?${params.toString()}`;
};

/**
 * Custom SWR hook for fetching feed items with pagination and filters.
 * This hook returns data in a structure similar to the products hook.
 */
export function useFeedItems(searchParams: URLSearchParams) {
  // Memoize the key so that it only changes when the actual query string changes
  const key = useMemo(() => getPaginatedFeedItemsKey(searchParams), [searchParams.toString()]);
  
  // Extract feedId for conditional fetching
  const feedId = searchParams.get('feedId');
  
  // Define the fetcher function based on whether feedId is present
  const fetcher = useCallback(async () => {
    console.log('SWR key:', key);
    let response;
    if (feedId) {
      response = await feedItemsApi.getByFeedId(feedId, searchParams);
    } else {
      response = await feedItemsApi.getAll(searchParams);
    }
    return response.data;
  }, [searchParams, feedId, key]);

  // Use SWR to fetch the data using the memoized key and additional options
  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<FeedItemResponse>>(
    key,
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      keepPreviousData: true,
    }
  );

  // Helper function to mark an item as read/unread and update the cache
  const updateReadStatus = useCallback(async (itemId: string, status: boolean) => {
    try {
      const response = await feedItemsApi.updateReadStatus(itemId, status);
      if (response.status === 'success') {
        // Update cached data without a full refetch
        mutate(
          (currentData) => {
            if (!currentData) return currentData;
            return {
              ...currentData,
              items: currentData.items.map(item =>
                item.itemId === itemId ? response.data : item
              )
            };
          },
          false
        );
        // Then revalidate to ensure consistency with the server
        mutate();
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  }, [mutate]);

  // Helper function to delete an item and update the cache
  const deleteItem = useCallback(async (itemId: string) => {
    try {
      const response = await feedItemsApi.delete(itemId);
      if (response.status === 'success') {
        // Revalidate to fetch the updated list
        mutate();
        return response;
      }
    } catch (error) {
      throw error;
    }
  }, [mutate]);

  return {
    data: data?.items || [],
    totalPages: data?.meta.totalPages || 0,
    currentPage: data?.meta.page || 1,
    totalCount: data?.meta.total || 0,
    isLoading,
    error,
    updateReadStatus,
    deleteItem,
    mutate
  };
}
