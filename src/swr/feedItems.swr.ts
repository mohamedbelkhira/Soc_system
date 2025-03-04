import useSWR from 'swr';
import { useCallback } from 'react';
import { feedItemsApi } from '@/api/feedItems.api';
import { FeedItemResponse } from '@/dto/feedItem.dto';
import { PaginatedResponse } from '@/types/pagination.type';

/**
 * Custom SWR hook for fetching feed items with pagination and filters
 */
export function useFeedItems(searchParams: URLSearchParams) {
  // Create a key that includes all search parameters for SWR caching
  const key = `/feeds-items?${searchParams.toString()}`;
  
  // Extract feedId for conditional fetching
  const feedId = searchParams.get('feedId');
  
  // Define the fetcher function based on whether feedId is present
  const fetcher = useCallback(async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      console.log('SWR key:', `/feeds-items?${searchParams.toString()}`);

      let response;
      if (feedId) {
        response = await feedItemsApi.getByFeedId(feedId, searchParams);
      } else {
        response = await feedItemsApi.getAll(searchParams);
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }, [searchParams, feedId]);

  // Use SWR to fetch the data
  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<FeedItemResponse>>(
    key,
    fetcher
  );

  // Helper function to mark an item as read/unread and update the cache
  const updateReadStatus = useCallback(async (itemId: string, status: boolean) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await feedItemsApi.updateReadStatus(itemId, status);
      
      if (response.status === 'success') {
        // Update the cached data without requiring a refetch
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
          false // Don't revalidate yet to avoid flickering
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
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await feedItemsApi.delete(itemId);
      
      if (response.status === 'success') {
        // Revalidate to refetch the updated list
        mutate();
        return response;
      }
    } catch (error) {
      throw error;
    }
  }, [mutate]);

  return {
    feedItems: data?.items || [],
    meta: data?.meta || {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1
    },
    isLoading,
    error,
    updateReadStatus,
    deleteItem,
    mutate
  };
}