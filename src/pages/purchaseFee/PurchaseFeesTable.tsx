// src/components/purchaseFees/PurchaseFeesTable.tsx
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
import CheckPermission from "@/components/common/CheckPermission";
import { Permission } from "@/types/permission.enum";
import { useAuth } from "@/contexts/auth-provider";
import { PurchaseFee } from "@/types/purchaseFee.dto";
import DeletePurchaseFeeDialog from "./delete/DeletePurchaseFeeDialog";
import UpdatePurchaseFeeDialog from "./update/UpdatePurchaseFeeDialog";

export default function PurchaseFeesTable({
  isLoading,
  purchaseFees,
  onChange,
}: {
  isLoading: boolean;
  purchaseFees: PurchaseFee[];
  onChange: () => void;
}) {
  const { user } = useAuth();
  useEffect(() => {
    console.log({ purchaseFees });
  }, [purchaseFees]);

  if (isLoading) return <Skeleton className="w-full rounded-md min-h-24" />;

  return (
    <TableWrapper>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[120px] text-center">Status</TableHead>
            <TableHead className="text-right w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchaseFees.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="py-8 text-center">
                Aucune frais d'achat trouvée.
              </TableCell>
            </TableRow>
          ) : (
            purchaseFees.map((fee) => (
              <TableRow key={fee.id}>
                <TableCell className="font-medium">{fee.name}</TableCell>
                <TableCell>{fee.description || "-"}</TableCell>
                <TableCell className="text-center">
                  <StatusTag isActive={fee.isActive} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {/* Edit Purchase Fee */}
                    <CheckPermission
                    requiredPermission={Permission.PURCHASE_EDIT}
                    grantedPermissions={user?.permissions}
                    >
                      <UpdatePurchaseFeeDialog
                        purchaseFee={fee}
                        onUpdate={onChange}
                      />
                    </CheckPermission> 
                   

                    {/* Delete Purchase Fee */}
                    <CheckPermission
                    requiredPermission={Permission.PURCHASE_DELETE}
                    grantedPermissions={user?.permissions}
                    >
                      <DeletePurchaseFeeDialog
                      purchaseFee={fee}
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
