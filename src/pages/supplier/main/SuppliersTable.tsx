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
import { Supplier } from "@/types/supplier.dto";

import DeleteSupplierDialog from "../delete/DeleteSupplierDialog";
import UpdateSupplierDialog from "../update/UpdateSupplierDialog";
import { useAuth } from "@/contexts/auth-provider";
import CheckPermission from "@/components/common/CheckPermission";
import { Permission } from "@/types/permission.enum";
export default function SuppliersTable({
  isLoading,
  suppliers,
  onChange,
}: {
  isLoading: boolean;
  suppliers: Supplier[];
  onChange: () => void;
}) {
  const {user}= useAuth();
  useEffect(() => {
    console.log({ suppliers });
  }, [suppliers]);

  if (isLoading) return <Skeleton className="w-full rounded-md min-h-24" />;

  return (
    <TableWrapper>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Nom</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[180px]">Téléphone</TableHead>
            <TableHead className="w-[180px]">Adresse</TableHead>
            <TableHead className="w-[120px] text-center">Statut</TableHead>
            <TableHead className="text-right w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="py-8 text-center">
                Aucun fournisseur trouvé.
              </TableCell>
            </TableRow>
          ) : (
            suppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell className="font-medium">{supplier.name}</TableCell>
                <TableCell>{supplier.description || "-"}</TableCell>
                <TableCell>{supplier.phoneNumber || "-"}</TableCell>
                <TableCell>{supplier.address || "-"}</TableCell>
                <TableCell className="text-center">
                  <StatusTag isActive={supplier.isActive} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {/* Edit Supplier */}
                    <CheckPermission
                      requiredPermission={Permission.PURCHASE_EDIT}
                      grantedPermissions={user?.permissions}
                      >
                      <UpdateSupplierDialog
                        supplier={supplier}
                        onUpdate={onChange}
                      />
                   </CheckPermission> 
                    {/* Delete Supplier */}
                    <CheckPermission
                      requiredPermission={Permission.PURCHASE_DELETE}
                      grantedPermissions={user?.permissions}
                      >
                      <DeleteSupplierDialog
                        supplier={supplier}
                        onDelete={onChange}
                      />
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
