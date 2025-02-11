import React, { useEffect } from "react";

import StatusTag from "@/components/common/StatusTag";
import TableWrapper from "@/components/common/TableWrapper";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Attribute } from "@/types/attribute.dto";
import { formatDate } from "@/utils/formatters/formatDate";
import getAttributeTypeLabel from "@/utils/type-transformers/getAttributeTypeLabel";

import DeleteAttributeDialog from "../delete/DeleteAttributeDialog";
import { UpdateAttributeDialog } from "../update/UpdateAttributeDialog";
import { useAuth } from "@/contexts/auth-provider";
import CheckPermission from "@/components/common/CheckPermission";
import { Permission } from "@/types/permission.enum";

export default function AttributesTable({
  isLoading,
  attributes,
}: {
  isLoading: boolean;
  attributes: Attribute[];
}) {
  const {user} = useAuth();
  useEffect(() => {
    console.log({ categories: attributes });
  }, [attributes]);

  if (isLoading) return <Skeleton className="w-full rounded-md min-h-24" />;

  return (
    <TableWrapper>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Créé à</TableHead>
            <TableHead>Mis à jour à</TableHead>
            <TableHead className="w-[180px] text-center">Statut</TableHead>
            <TableHead className="w-[100px] text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attributes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-8 text-center">
                Aucun attribut trouvé.
              </TableCell>
            </TableRow>
          ) : (
            attributes.map((attribute) => (
              <TableRow key={attribute.id}>
                <TableCell className="font-medium">{attribute.name}</TableCell>
                <TableCell>{getAttributeTypeLabel(attribute.type)}</TableCell>
                <TableCell>{formatDate(attribute.createdAt)}</TableCell>
                <TableCell>{formatDate(attribute.updatedAt)}</TableCell>
                <TableCell className="flex items-center">
                  <StatusTag isActive={attribute.isActive} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                  <CheckPermission
                    requiredPermission={Permission.PRODUCT_EDIT}
                    grantedPermissions={user?.permissions}
                    >
                    <UpdateAttributeDialog attribute={attribute} />
                    </CheckPermission> 
                    <CheckPermission
                    requiredPermission={Permission.PRODUCT_EDIT}
                    grantedPermissions={user?.permissions}
                    >
                      <DeleteAttributeDialog attribute={attribute} />
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
}
