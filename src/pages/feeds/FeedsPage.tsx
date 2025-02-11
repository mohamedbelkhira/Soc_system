// src/components/pages/FeedsPage.tsx
import { useState, useEffect } from 'react';
import { feedsApi } from '@/api/feeds.api';
import { FeedResponse } from "@/dto/feed.dto";
import FeedsTable from './FeedsTable';
import { showToast } from '@/utils/showToast';
import CreateFeedDialog from '@/pages/feeds/create/CreateFeedPage';
import CheckPermission from '@/components/common/CheckPermission';
import { Permission } from '@/types/permission.enum';
import { Page, PageHeader, PageTitle, PageContent } from '@/components/common/Page';
import { useAuth } from '@/contexts/auth-provider';

export function FeedsPage() {
  const { user } = useAuth();
  const [feeds, setFeeds] = useState<FeedResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFeeds();
  }, []);

  const fetchFeeds = async () => {
    setIsLoading(true);
    try {
      const response = await feedsApi.getAll();
      if (response.status === 'success') {
        setFeeds(response.data);
      } else {
        showToast('error', response.message || 'Erreur lors du chargement des flux');
      }
    } catch (error) {
      showToast('error', 'Erreur de connexion');
      console.error('Failed to fetch feeds:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Page>
      <PageHeader className="flex flex-row items-center justify-between" showBackButton>
        <PageTitle>Gestion des Flux</PageTitle>
        <CheckPermission
          requiredPermission={Permission.SETTINGS_CREATE}
          grantedPermissions={user?.permissions}
        >
          <CreateFeedDialog onCreate={fetchFeeds} />
        </CheckPermission>
      </PageHeader>
      <PageContent>
        <FeedsTable 
          isLoading={isLoading} 
          feeds={feeds} 
          onChange={fetchFeeds} 
        />
      </PageContent>
    </Page>
  );
}

export default FeedsPage;
