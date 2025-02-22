// src/pages/FeedItemsPage.tsx
import { useState, useEffect } from 'react';
import { feedItemsApi } from '@/api/feedItems.api';
import { FeedItemResponse } from "@/dto/feedItem.dto";
import FeedItemCard from '@/components/common/FeedItemCard';
import { showToast } from '@/utils/showToast';
import { Page, PageHeader, PageTitle, PageContent } from '@/components/common/Page';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { feedsApi } from '@/api/feeds.api';
import { FeedResponse } from '@/dto/feed.dto';

export function FeedItemsPage() {
  const [feedItems, setFeedItems] = useState<FeedItemResponse[]>([]);
  const [feeds, setFeeds] = useState<FeedResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFeed, setSelectedFeed] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch both feeds and feed items on component mount
  useEffect(() => {
    fetchFeeds();
    fetchFeedItems();
  }, []);

  // Fetch feed items whenever the selected feed changes
  useEffect(() => {
    fetchFeedItems();
  }, [selectedFeed]);

  const fetchFeeds = async () => {
    try {
      const response = await feedsApi.getAll();
      if (response.status === 'success') {
        setFeeds(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch feeds:', error);
      showToast('error', 'Error loading feeds');
    }
  };

  const fetchFeedItems = async () => {
    setIsLoading(true);
    try {
      let response;
      if (selectedFeed === 'all') {
        response = await feedItemsApi.getAll();
      } else {
        response = await feedItemsApi.getByFeedId(selectedFeed);
      }

      if (response.status === 'success') {
        setFeedItems(response.data);
      } else {
        showToast('error', response.message || 'Error loading feed items');
      }
    } catch (error) {
      showToast('error', 'Connection error');
      console.error('Failed to fetch feed items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReadStatusChange = async (itemId: string, status: boolean) => {
    try {
      const response = await feedItemsApi.updateReadStatus(itemId, status);
      if (response.status === 'success') {
        setFeedItems(feedItems.map(item => 
          item.itemId === itemId ? response.data : item
        ));
        showToast('success', `Marked as ${status ? 'read' : 'unread'}`);
      }
    } catch (error) {
      showToast('error', 'Failed to update status');
      console.error('Failed to update read status:', error);
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      const response = await feedItemsApi.delete(itemId);
      if (response.status === 'success') {
        setFeedItems(feedItems.filter(item => item.itemId !== itemId));
        showToast('success', 'Feed item deleted successfully');
      }
    } catch (error) {
      showToast('error', 'Failed to delete feed item');
      console.error('Failed to delete feed item:', error);
    }
  };

  // Filter feed items based on search query
  const filteredFeedItems = feedItems.filter(item => 
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Page>
      <PageHeader className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0" showBackButton>
        <PageTitle>Feed Items</PageTitle>
        
        <div className="flex flex-col space-y-2 md:flex-row md:space-x-4 md:space-y-0">
          <Input
            placeholder="Search feed items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
          
          <Select
            value={selectedFeed}
            onValueChange={setSelectedFeed}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Feed" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Feeds</SelectItem>
              {feeds.map(feed => (
                <SelectItem key={feed.feedId} value={feed.feedId}>
                  {feed.title || feed.url}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PageHeader>

      <PageContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : filteredFeedItems.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No feed items found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFeedItems.map(item => (
              <FeedItemCard
                key={item.itemId}
                item={item}
                onReadStatusChange={handleReadStatusChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </PageContent>
    </Page>
  );
}

export default FeedItemsPage;