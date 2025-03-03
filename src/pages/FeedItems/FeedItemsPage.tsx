import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, Filter, X } from 'lucide-react';
import FeedItemCard from '@/components/common/FeedItemCard';
import { showToast } from '@/utils/showToast';
import { Page, PageHeader, PageTitle, PageContent } from '@/components/common/Page';
import { Button } from "@/components/ui/button";
import { usePagination } from '@/hooks/use-pagination';
import { useFeedItemsFilters } from "./useFeedItemsFilters";
import FeedItemsFilters from './FeedItemsFilters';
import CustomPagination from '@/components/common/CustomPagination';

import useSWR from 'swr';
import { feedsApi } from '@/api/feeds.api';
import { useFeedItems } from '@/swr/feedItems.swr';

export function FeedItemsPage() {
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const [searchInputValue, setSearchInputValue] = useState('');

  const { currentPage, handlePageChange } = usePagination(10);
  const { filters, setFilter, clearFilters, hasActiveFilters } = useFeedItemsFilters();

  // Update search input value when filters change
  useEffect(() => {
    if (filters.searchTerm !== undefined && searchInputValue !== filters.searchTerm) {
      setSearchInputValue(filters.searchTerm || '');
    }
  }, [filters.searchTerm]);


  // Use SWR to fetch feeds
  const { data: feeds = [], error: feedsError } = useSWR(
    '/feeds',
    async () => {
      const response = await feedsApi.getAll();
      if (response.status === 'success') {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch feeds');
    }
  );

  // Use our custom SWR hook for feed items
  const {
    feedItems,
    meta: paginationMeta,
    isLoading,
    error: feedItemsError,
    updateReadStatus,
    deleteItem
  } = useFeedItems(searchParams);

  // Handle errors
  useEffect(() => {
    if (feedsError) {
      console.error('Failed to fetch feeds:', feedsError);
      showToast('error', 'Error loading feeds');
    }
  }, [feedsError]);

  useEffect(() => {
    if (feedItemsError) {
      console.error('Failed to fetch feed items:', feedItemsError);
      showToast('error', 'Error loading feed items');
    }
  }, [feedItemsError]);

  const handleReadStatusChange = async (itemId: string, status: boolean) => {
    try {
      await updateReadStatus(itemId, status);
      showToast('success', `Marked as ${status ? 'read' : 'unread'}`);
    } catch (error) {
      showToast('error', 'Failed to update status');
      console.error('Failed to update read status:', error);
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      await deleteItem(itemId);
      
      // If we're on the last page and this is the only item, go back one page
      if (paginationMeta.page > 1 && feedItems.length === 1) {
        handlePageChange(paginationMeta.page - 1);
      }
      
      showToast('success', 'Feed item deleted successfully');
    } catch (error) {
      showToast('error', 'Failed to delete feed item');
      console.error('Failed to delete feed item:', error);
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Enhanced clearFilters function that also resets the search input value
  const handleClearFilters = () => {
    setSearchInputValue('');
    clearFilters();
  };

  return (
    <Page>
      <PageHeader className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0" showBackButton>
        <PageTitle>Feed Items ({paginationMeta.total})</PageTitle>
        
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={showFilters ? "secondary" : "outline"}
            onClick={toggleFilters}
            className="flex items-center gap-1"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          
          {hasActiveFilters && (
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleClearFilters} // Use the enhanced clear function
              className="flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>
      </PageHeader>

      <PageContent>
        {showFilters && (
          <FeedItemsFilters
            filters={filters}
            setFilter={setFilter}
            clearFilters={handleClearFilters} // Use the enhanced clear function
            hasActiveFilters={hasActiveFilters}
            feeds={feeds}
            searchInputValue={searchInputValue} // Pass the controlled search value
            setSearchInputValue={setSearchInputValue} // Pass the setter
          />
        )}
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : feedItems.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No feed items found
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {feedItems.map(item => (
                <FeedItemCard
                  key={item.itemId}
                  item={item}
                  onReadStatusChange={handleReadStatusChange}
                  onDelete={handleDelete}
                />
              ))}
            </div>
            
            <CustomPagination
              currentPage={currentPage}
              totalPages={paginationMeta.totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </PageContent>
    </Page>
  );
}

export default FeedItemsPage;