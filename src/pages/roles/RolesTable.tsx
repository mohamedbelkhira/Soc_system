// src/pages/roles/RolesTable.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

import TableWrapper from "@/components/common/TableWrapper";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RoleResponse } from "@/types/role.dto";
import { formatDate } from "@/utils/formatters/formatDate";
import { Edit3 } from "lucide-react";
import { useAuth } from "@/contexts/auth-provider";
import CheckPermission from "@/components/common/CheckPermission";
import { Permission } from "@/types/permission.enum";

import DeleteRoleDialog from "./delete/DeleteRoleDialog";

interface RolesTableProps {
  isLoading: boolean;
  roles: RoleResponse[];
  onChange: () => void;
}

const RolesTable: React.FC<RolesTableProps> = ({
  isLoading,
  roles,
  onChange,
}) => {
  const navigate = useNavigate();
  const {user} = useAuth();
  const handleEditRole = (id: string) => {
    navigate(`/role_update/${id}`); // Navigate to the UpdateRolePage
  };

  if (isLoading) return <Skeleton className="w-full rounded-md min-h-24" />;

  return (
    <TableWrapper>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Nom du Rôle</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="hidden lg:table-cell w-[120px] min-w-[120px] text-center">
              Créé à
            </TableHead>
            <TableHead className="hidden lg:table-cell w-[120px] min-w-[120px] text-center">
              Mis à jour à
            </TableHead>
            <TableHead className="text-right w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
                Aucun rôle trouvé.
              </TableCell>
            </TableRow>
          ) : (
            roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell className="font-medium">
                  {role.name || "Rôle sans nom"}
                </TableCell>
                <TableCell>{role.description || "-"}</TableCell>
                <TableCell className="text-center hidden lg:table-cell">
                  {formatDate(role.createdAt)}
                </TableCell>
                <TableCell className="text-center hidden lg:table-cell">
                  {formatDate(role.updatedAt)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                  <CheckPermission
                    requiredPermission={Permission.SETTINGS_EDIT}
                    grantedPermissions={user?.permissions}
                    >
                      <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditRole(role.id)}
                    >
                      <Edit3 className="h-4 w-4 text-primary" />
                    </Button>

                    </CheckPermission> 
                    <CheckPermission
                    requiredPermission={Permission.SETTINGS_DELETE}
                    grantedPermissions={user?.permissions}
                    >
                    <DeleteRoleDialog role={role} onDelete={onChange} />
                    </CheckPermission> 
                 </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableWrapper>
  );
};

export default RolesTable;
