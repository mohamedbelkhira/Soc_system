// src/components/tables/UsersTable.tsx
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserResponse } from "@/dto/user.dto";
import CheckPermission from "@/components/common/CheckPermission";
import { Permission } from "@/types/permission.enum";
import DeleteUserDialog from "./delete/DeleteUserDialog";
import UpdateUserDialog from "./update/UpdateUserDialog";
import TableWrapper from "@/components/common/TableWrapper";
import { useAuth } from "@/contexts/auth-provider";

interface UsersTableProps {
  isLoading: boolean;
  users: UserResponse[];
  onChange: () => void;
}

const UsersTable: React.FC<UsersTableProps> = ({ isLoading, users, onChange }) => {
  const { user } = useAuth();

  if (isLoading) return <Skeleton className="w-full rounded-md min-h-24" />;

  return (
    <TableWrapper>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="hidden lg:table-cell text-center">Active</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            users.map((userData) => (
              <TableRow key={userData.id}>
                <TableCell className="font-medium">{userData.username}</TableCell>
                <TableCell>{userData.role?.name || '-'}</TableCell>
                <TableCell className="text-center hidden lg:table-cell">
                  {userData.isActive ? "Yes" : "No"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <CheckPermission requiredPermission={Permission.SETTINGS_EDIT} grantedPermissions={user?.permissions}>
                      <UpdateUserDialog user={userData} onUpdate={onChange} />
                    </CheckPermission>
                    <CheckPermission requiredPermission={Permission.SETTINGS_DELETE} grantedPermissions={user?.permissions}>
                      <DeleteUserDialog user={userData} onDelete={onChange} />
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

export default UsersTable;
