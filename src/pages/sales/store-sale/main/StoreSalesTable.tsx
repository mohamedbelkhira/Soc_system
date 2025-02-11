import CheckPermission from "@/components/common/CheckPermission";
import TableWrapper from "@/components/common/TableWrapper";
import DeleteAction from "@/components/common/actions/DeleteAction";
import UpdateAction from "@/components/common/actions/UpdateAction";
import ViewAction from "@/components/common/actions/ViewAction";
import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/auth-provider";
import { StoreSaleStatus } from "@/schemas/sales/store-sale.schema";
import { Permission } from "@/types/permission.enum";
import { StoreSale } from "@/types/sales/store-sale.dto";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { formatDate } from "@/utils/formatters/formatDate";
import getClientLabel from "@/utils/getClientLabel";

import DeleteStoreSaleDialog from "../delete/DeleteStoreSaleDialog";
import StoreSaleStatusTag from "./StoreSaleStatusTag";

export default function StoreSalesTable({
  isLoading,
  storeSales,
}: {
  isLoading: boolean;
  storeSales: StoreSale[];
}) {
  const { user } = useAuth();

  if (isLoading) return <TableSkeleton />;

  return (
    <TableWrapper>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Référence</TableHead>
            <TableHead>Date de création</TableHead>
            <TableHead>Date de vente</TableHead>
            <TableHead>Date d'annulation</TableHead>
            <TableHead className="w-[180px] text-center">Statut</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Montant Total</TableHead>
            <TableHead>Montant payé</TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {storeSales.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>
                Aucune vente en magasin trouvée.
              </TableCell>
            </TableRow>
          ) : (
            storeSales.map((storeSale) => (
              <TableRow key={storeSale.id}>
                <TableCell className="font-medium">
                  {storeSale.sale.reference}
                </TableCell>
                <TableCell>{formatDate(storeSale.createdAt)}</TableCell>
                <TableCell>
                  {storeSale.completedAt ? (
                    formatDate(storeSale.completedAt)
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {storeSale.canceledAt ? (
                    formatDate(storeSale.canceledAt)
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <StoreSaleStatusTag status={storeSale.status} />
                </TableCell>
                <TableCell>
                  {storeSale.client ? (
                    getClientLabel(storeSale.client)
                  ) : (
                    <span className="text-muted-foreground">Non Spécifié</span>
                  )}
                </TableCell>
                <TableCell>
                  {formatCurrency(storeSale.sale.totalAmount)}
                </TableCell>
                <TableCell>
                  {formatCurrency(
                    storeSale.sale.totalAmount -
                      (storeSale.sale.discountAmount ?? 0)
                  )}
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <CheckPermission
                      requiredPermission={Permission.SALE_VIEW}
                      grantedPermissions={user?.permissions}
                    >
                      <ViewAction href={`/store-sales/${storeSale.id}`} />
                    </CheckPermission>
                    <CheckPermission
                      requiredPermission={Permission.SALE_EDIT}
                      grantedPermissions={user?.permissions}
                    >
                      <UpdateAction
                        disabled={storeSale.status === StoreSaleStatus.CANCELED}
                        tooltipMessage="Impossible de modifier la vente annulée"
                        href={`/store-sales/${storeSale.id}/edit`}
                      />
                    </CheckPermission>
                    <CheckPermission
                      requiredPermission={Permission.SALE_DELETE}
                      grantedPermissions={user?.permissions}
                    >
                      <DeleteStoreSaleDialog
                        storeSale={storeSale}
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
