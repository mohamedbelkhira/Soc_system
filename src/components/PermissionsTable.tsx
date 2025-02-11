// src/components/PermissionsTable.tsx

import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  PermissionGroup,
  permissionActions,
  permissionGroups,
} from '@/constants/permissions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import TableWrapper from '@/components/common/TableWrapper'; // Ensure this exists or replace as needed

interface PermissionsTableProps {
  selectedPermissions: string[];
  onChange: (permissions: string[]) => void;
}

const PermissionsTable: React.FC<PermissionsTableProps> = ({
  selectedPermissions,
  onChange,
}) => {
  const handlePermissionChange = (code: string, checked: boolean) => {
    let newPermissions = [...selectedPermissions];
    if (checked) {
      if (!newPermissions.includes(code)) {
        newPermissions.push(code);
      }
    } else {
      newPermissions = newPermissions.filter((perm) => perm !== code);
    }
    onChange(newPermissions);
  };

  const handleGroupAllChange = (group: PermissionGroup, checked: boolean) => {
    let newPermissions = [...selectedPermissions];
    const groupPermissionCodes = group.permissions.map((perm) => perm.code);

    if (checked) {
      // Add all group permissions
      groupPermissionCodes.forEach((code) => {
        if (!newPermissions.includes(code)) {
          newPermissions.push(code);
        }
      });
    } else {
      // Remove all group permissions
      newPermissions = newPermissions.filter(
        (perm) => !groupPermissionCodes.includes(perm)
      );
    }

    onChange(newPermissions);
  };

  return (
    <TableWrapper>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Nom</TableHead>
            {permissionActions.map(({ action, label }) => (
              <TableHead key={action} className="text-center">
                {label}
              </TableHead>
            ))}
            <TableHead className="text-center">Tous</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {permissionGroups.map((group) => (
            <TableRow key={group.groupCode}>
              <TableCell className="text-left">{group.groupName}</TableCell>
              {permissionActions.map(({ action }) => {
                const permissionCode = `${group.groupCode}_${action}`;
                const isChecked = selectedPermissions.includes(permissionCode);
                return (
                  <TableCell
                    className="text-center"
                    key={action}
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={(checked) =>
                        handlePermissionChange(
                          permissionCode,
                          checked === true
                        )
                      }
                      id={`${permissionCode}`}
                    />
                  </TableCell>
                );
              })}
              <TableCell className="text-center">
                <Checkbox
                  checked={group.permissions.every((perm) =>
                    selectedPermissions.includes(perm.code)
                  )}
                  onCheckedChange={(checked) =>
                    handleGroupAllChange(group, checked === true)
                  }
                  id={`${group.groupCode}_all`}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableWrapper>
  );
};

export default PermissionsTable;
