import { useTags } from '@/swr/tags.swr';
import TagsTable from './TagsTable';
import { showToast } from '@/utils/showToast';
import { useAuth } from '@/contexts/auth-provider';
import CheckPermission from '@/components/common/CheckPermission';
import { Permission } from '@/types/permission.enum';
import { Page, PageHeader, PageTitle, PageContent } from '@/components/common/Page';
import CreateTagDialog from './create/CreateTagDialog';
import { useEffect } from 'react';

export function TagsPage() {
    const { user } = useAuth();
    const { tags, isLoading, error, mutate } = useTags();

    useEffect(() => {
        if (error) {
            showToast('error', 'Erreur lors du chargement des tags');
            console.error('Failed to fetch tags:', error);
        }
    }, [error]);

    return (
        <Page>
            <PageHeader className="flex flex-row items-center justify-between" showBackButton>
                <PageTitle>Gestion des Tags</PageTitle>
                <CheckPermission
                    requiredPermission={Permission.SETTINGS_CREATE}
                    grantedPermissions={user?.permissions}
                >
                    <CreateTagDialog onSuccess={mutate} />
                </CheckPermission>
            </PageHeader>
            <PageContent>
                <TagsTable
                    isLoading={isLoading}
                    tags={tags}
                    onRefresh={mutate}
                />
            </PageContent>
        </Page>
    );
}

export default TagsPage;
