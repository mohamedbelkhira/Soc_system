

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { rolesApi } from '@/api/roles.api';
import { RoleResponse } from "@/types/role.dto"
import RolesTable from './RolesTable';
import { showToast } from '@/utils/showToast';
import AddButton from '@/components/common/AddButton';
import { useAuth } from '@/contexts/auth-provider';
import CheckPermission from '@/components/common/CheckPermission';
import { Permission } from '@/types/permission.enum';

export function RolesPage() {
  const {user} = useAuth();
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const response = await rolesApi.getAll();
      if (response.status === 'success') {
        setRoles(response.data);
      } else {
        showToast('error', response.message || 'Erreur lors du chargement des rôles');
      }
    } catch (error) {
      showToast('error', 'Erreur de connexion');
      console.error('Failed to fetch roles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestion des Rôles</CardTitle>
        <CheckPermission
              requiredPermission={Permission.SETTINGS_CREATE}
              grantedPermissions={user?.permissions}
         >            
        <AddButton label="Ajouter un rôle" href="/role_add"/>
        </CheckPermission>  
      </CardHeader>
      <CardContent>
        <RolesTable
          isLoading={isLoading}
          roles={roles}
          onChange={fetchRoles}
        />
      </CardContent>
    </Card>
  );
}

export default RolesPage;
