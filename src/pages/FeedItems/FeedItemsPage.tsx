import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, Filter, X } from 'lucide-react';
import FeedItemCard from '@/components/common/FeedItemCard';
import { showToast } from '@/utils/showToast';
import { Page, PageHeader, PageTitle, PageContent } from '@/components/common/Page';
import { Button } from '@/components/ui/button';
import { usePagination } from '@/hooks/use-pagination';
import { useFeedItemsFilters } from './useFeedItemsFilters';
import FeedItemsFilters from './FeedItemsFilters';
import CustomPagination from '@/components/common/CustomPagination';
import AnimatedFiltersWrapper from '@/components/common/AnimatedFiltersWrapper';
import useSWR from 'swr';
import { feedsApi } from '@/api/feeds.api';
import { useFeedItems } from '@/swr/feedItems.swr';

export function FeedItemsPage() {
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState('');

  const { currentPage, handlePageChange } = usePagination(10);
  const { filters, setFilter, clearFilters, hasActiveFilters } = useFeedItemsFilters();

  // Fetch feeds using SWR (unchanged)
  const { data: feeds = [], error: feedsError, isLoading: feedsLoading } = useSWR(
    '/feeds',
    async () => {
      const response = await feedsApi.getAll();
      if (response.status === 'success') {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch feeds');
    },
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );

  // Use the custom SWR hook for feed items, which returns a paginated structure
  const {
    data: feedItems,
    totalPages,
    currentPage: feedItemsPage, // current page from feed items response if needed
    totalCount,
    isLoading,
    error: feedItemsError,
    updateReadStatus,
    deleteItem,
    mutate,
  } = useFeedItems(searchParams);

  // Initialize search input value from URL params
  useEffect(() => {
    const searchTermFromUrl = searchParams.get('searchTerm');
    setSearchInputValue(searchTermFromUrl || '');
  }, [searchParams]);

  // Handle feeds fetch error
  useEffect(() => {
    if (feedsError) {
      console.error('Failed to fetch feeds:', feedsError);
      showToast('error', 'Error loading feeds');
    }
  }, [feedsError]);

  // Handle feed items fetch error
  useEffect(() => {
    if (feedItemsError) {
      console.error('Failed to fetch feed items:', feedItemsError);
      showToast('error', 'Error loading feed items');
    }
  }, [feedItemsError]);

  // Show a full-page loader until both feeds and feed items are loaded
  if (feedsLoading || isLoading) {
    return (
      <Page>
        <PageContent>
          <div className="flex items-center justify-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </PageContent>
      </Page>
    );
  }

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
      // If on the last page and this is the only item, go back one page
      if (currentPage > 1 && feedItems.length === 1) {
        handlePageChange(currentPage - 1);
      }
      showToast('success', 'Feed item deleted successfully');
    } catch (error) {
      showToast('error', 'Failed to delete feed item');
      console.error('Failed to delete feed item:', error);
    }
  };

  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };

  const handleClearFilters = () => {
    setSearchInputValue('');
    clearFilters();
  };

  return (
    <Page>
      <PageHeader className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0" showBackButton>
        <PageTitle>Feed Items ({totalCount})</PageTitle>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={showFilters ? 'secondary' : 'outline'}
            onClick={toggleFilters}
            className="flex items-center gap-1"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          {hasActiveFilters && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearFilters}
              className="flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>
      </PageHeader>
      <PageContent>
        <AnimatedFiltersWrapper isVisible={showFilters}>
          <FeedItemsFilters
            filters={filters}
            setFilter={setFilter}
            clearFilters={handleClearFilters}
            hasActiveFilters={hasActiveFilters}
            feeds={feeds}
            searchInputValue={searchInputValue}
            setSearchInputValue={setSearchInputValue}
          />
        </AnimatedFiltersWrapper>
        {feedItems.length === 0 ? (
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
              currentPage={currentPage}  // using pagination state from usePagination
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </PageContent>
    </Page>
  );
}

export default FeedItemsPage;
