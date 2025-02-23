// src/components/pages/UsersPage.tsx
import { useState, useEffect } from 'react';
import { usersApi } from '@/api/user.api';
import { UserResponse } from '@/dto/user.dto';
import UsersTable from './UsersTable';
import { showToast } from '@/utils/showToast';
import CreateUserDialog from './create/CreateUserDialog';
import CheckPermission from '@/components/common/CheckPermission';
import { Permission } from '@/types/permission.enum';
import { Page, PageHeader, PageTitle, PageContent } from '@/components/common/Page';
import { useAuth } from '@/contexts/auth-provider';

export function UsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await usersApi.getAll();
      if (response.status === 'success') {
        setUsers(response.data);
      } else {
        showToast('error', response.message || 'Error loading users');
      }
    } catch (error) {
      showToast('error', 'Connection error');
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Page>
      <PageHeader className="flex flex-row items-center justify-between" showBackButton>
        <PageTitle>User Management</PageTitle>
        <CheckPermission requiredPermission={Permission.SETTINGS_CREATE} grantedPermissions={user?.permissions}>
          <CreateUserDialog onCreate={fetchUsers} />
        </CheckPermission>
      </PageHeader>
      <PageContent>
        <UsersTable isLoading={isLoading} users={users} onChange={fetchUsers} />
      </PageContent>
    </Page>
  );
}

export default UsersPage;
