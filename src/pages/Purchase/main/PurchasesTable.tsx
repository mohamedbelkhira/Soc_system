import React, { useEffect } from "react";

import CheckPermission from "@/components/common/CheckPermission";
import PurchaseStatusTag from "@/components/common/PurchaseStatusTag";
import TableWrapper from "@/components/common/TableWrapper";
import DeleteAction from "@/components/common/actions/DeleteAction";
import UpdateAction from "@/components/common/actions/UpdateAction";
import ViewAction from "@/components/common/actions/ViewAction";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/auth-provider";
import { Permission } from "@/types/permission.enum";
import { Purchase } from "@/types/purchase.dto";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { formatDate } from "@/utils/formatters/formatDate";
import { calculateTotalQuantity } from "@/utils/purchase/calculateTotalQuantity";
import DeletePurchaseDialog from "../delete/DeletePurchaseDialog";

export default function PurchasesTable({
  isLoading,
  purchases,
}: {
  isLoading: boolean;
  purchases: Purchase[];
}) {
  const { user } = useAuth();
  useEffect(() => {
    console.log({ purchases });
  }, [purchases]);

  if (isLoading) return <Skeleton className="w-full rounded-md min-h-24" />;

  return (
    <TableWrapper>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fournisseur</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Date de commande</TableHead>
            <TableHead>Date de réception</TableHead>
            <TableHead>Montant total</TableHead>
            <TableHead>Nombre d'articles</TableHead>
            <TableHead className="text-wrap">Description</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchases.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="py-8 text-center">
                Aucun achat trouvé.
              </TableCell>
            </TableRow>
          ) : (
            purchases.map((purchase) => (
              <TableRow key={purchase.id}>
                <TableCell>{purchase.supplier.name}</TableCell>
                <TableCell>
                  <PurchaseStatusTag state={purchase.state} />
                </TableCell>
                <TableCell>
                  {purchase.orderedAt
                    ? formatDate(purchase.orderedAt)
                    : "Non spécifier"}
                </TableCell>
                <TableCell>
                  {purchase.state === 'RECEIVED' 
                    ? (purchase.receivedAt ? formatDate(purchase.receivedAt) : "Non spécifier")
                    : "Non reçu"
                  }
                </TableCell>
                <TableCell>{formatCurrency(purchase.totalAmount)}</TableCell>
                <TableCell>{calculateTotalQuantity(purchase)} articles</TableCell>
                <TableCell className="text-wrap">
                  {purchase.description || "---"}
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <CheckPermission
                      requiredPermission={Permission.PURCHASE_VIEW}
                      grantedPermissions={user?.permissions}
                    >
                      <ViewAction href={`/purchases/${purchase.id}`} />
                    </CheckPermission>
                    <CheckPermission
                      requiredPermission={Permission.PURCHASE_EDIT}
                      grantedPermissions={user?.permissions}
                    >
                      <UpdateAction href={`/purchases/${purchase.id}/edit`} />
                    </CheckPermission>
                    <CheckPermission
                      requiredPermission={Permission.PURCHASE_DELETE}
                      grantedPermissions={user?.permissions}
                    >
                      <DeletePurchaseDialog
                        purchase={purchase}
                        trigger={<DeleteAction />}
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
