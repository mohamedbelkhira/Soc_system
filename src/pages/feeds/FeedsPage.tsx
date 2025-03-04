import { useFeeds } from '../../swr/feeds.swr'
import FeedsTable from './FeedsTable';
import CreateFeedDialog from '@/pages/feeds/create/CreateFeedPage';
import CheckPermission from '@/components/common/CheckPermission';
import { Permission } from '@/types/permission.enum';
import { Page, PageHeader, PageTitle, PageContent } from '@/components/common/Page';
import { useAuth } from '@/contexts/auth-provider';

export function FeedsPage() {
  const { user } = useAuth();
  const { feeds, isLoading } = useFeeds();
  console.log("feeds", feeds);
  return (
    <Page>
      <PageHeader className="flex flex-row items-center justify-between" showBackButton>
        <PageTitle>Gestion des Flux</PageTitle>
        <CheckPermission
          requiredPermission={Permission.FEEDS_CREATE}
          grantedPermissions={user?.permissions}
        >
          <CreateFeedDialog />
        </CheckPermission>
      </PageHeader>
      <PageContent>
        <FeedsTable
          isLoading={isLoading}
          feeds={feeds}
        />
      </PageContent>
    </Page>
  );
}

export default FeedsPage;