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
import { OnlineSaleStatus } from "@/schemas/sales/online-sale.schema";
import { Permission } from "@/types/permission.enum";
import { OnlineSale } from "@/types/sales/online-sale.dto";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { formatDate } from "@/utils/formatters/formatDate";
import getClientLabel from "@/utils/getClientLabel";
import getDeliveryHandlerLabel from "@/utils/getDeliveryHandlerLabel";

import DeleteOnlineSaleDialog from "../delete/DeleteOnlineSaleDialog";
import OnlineSaleStatusTag from "../shared/OnlineSaleStatusTag";

export default function OnlineSalesTable({
  isLoading,
  onlineSales,
}: {
  isLoading: boolean;
  onlineSales: OnlineSale[];
}) {
  const { user } = useAuth();
  if (isLoading) return <TableSkeleton />;

  return (
    <TableWrapper>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Référence</TableHead>
            <TableHead>Numéro de Suivi</TableHead>
            <TableHead>Date de Création</TableHead>
            <TableHead>Date de Vente</TableHead>
            <TableHead>Date de Retour</TableHead>
            <TableHead>Date d'Annulation</TableHead>
            <TableHead className="w[180px] text-center">Statut</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Livreur</TableHead>
            <TableHead>Montant à Payé</TableHead>
            <TableHead className="text-right w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {onlineSales.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9}>Aucune vente en ligne trouvée.</TableCell>
            </TableRow>
          ) : (
            onlineSales.map((onlineSale) => (
              <TableRow key={onlineSale.id}>
                <TableCell className="font-medium">
                  {onlineSale.sale.reference}
                </TableCell>
                <TableCell className="font-medium">
                  {onlineSale.trackingNumber || (
                    <span className="text-muted-foreground">Non spécifié</span>
                  )}
                </TableCell>
                <TableCell>{formatDate(onlineSale.createdAt)}</TableCell>
                <TableCell>
                  {onlineSale.completedAt
                    ? formatDate(onlineSale.completedAt)
                    : "-"}
                </TableCell>
                <TableCell>
                  {onlineSale.returnedAt
                    ? formatDate(onlineSale.returnedAt)
                    : "-"}
                </TableCell>
                <TableCell>
                  {onlineSale.canceledAt
                    ? formatDate(onlineSale.canceledAt)
                    : "-"}
                </TableCell>

                <TableCell className="text-center">
                  <OnlineSaleStatusTag status={onlineSale.status} />
                </TableCell>
                <TableCell>
                  {onlineSale.client ? (
                    getClientLabel(onlineSale.client)
                  ) : (
                    <span className="text-muted-foreground">Non Spécifié</span>
                  )}
                </TableCell>
                <TableCell>
                  {onlineSale.deliveryHandler ? (
                    getDeliveryHandlerLabel(onlineSale.deliveryHandler)
                  ) : (
                    <span className="text-muted-foreground">
                      Pas de livreur
                    </span>
                  )}
                </TableCell>

                <TableCell>
                  {formatCurrency(
                    onlineSale.sale.totalAmount -
                      (onlineSale.sale.discountAmount ?? 0)
                  )}
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <CheckPermission
                      requiredPermission={Permission.SALE_VIEW}
                      grantedPermissions={user?.permissions}
                    >
                      <ViewAction href={`/online-sales/${onlineSale.id}`} />
                    </CheckPermission>
                    <CheckPermission
                      requiredPermission={Permission.SALE_EDIT}
                      grantedPermissions={user?.permissions}
                    >
                      <UpdateAction
                        disabled={
                          onlineSale.status === OnlineSaleStatus.CANCELED ||
                          onlineSale.status === OnlineSaleStatus.RETURNED
                        }
                        tooltipMessage="Impossible de modifier la vente annulée ou retournée"
                        href={`/online-sales/${onlineSale.id}/edit`}
                      />
                    </CheckPermission>
                    <CheckPermission
                      requiredPermission={Permission.SALE_DELETE}
                      grantedPermissions={user?.permissions}
                    >
                      <DeleteOnlineSaleDialog
                        onlineSale={onlineSale}
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
