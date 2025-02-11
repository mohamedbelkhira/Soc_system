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
import { AdvanceSaleStatus } from "@/schemas/sales/advance-sale.schema";
import { Permission } from "@/types/permission.enum";
import { AdvanceSale } from "@/types/sales/advance-sale.dto";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { formatDate } from "@/utils/formatters/formatDate";
import getClientLabel from "@/utils/getClientLabel";

import DeleteAdvanceSaleDialog from "../delete/DeleteAdvanceSaleDialog";
import AdvanceSaleStatusTag from "./AdvanceSaleStatusTag";

export default function AdvanceSalesTable({
  isLoading,
  advanceSales,
}: {
  isLoading: boolean;
  advanceSales: AdvanceSale[];
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
            <TableHead>Date de mise à jour</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Montant à Payé</TableHead>
            <TableHead>Montant Payé</TableHead>
            <TableHead>Reste à Payer</TableHead>
            <TableHead className="text-right w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {advanceSales.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>
                Aucune vente avec avance trouvée.
              </TableCell>
            </TableRow>
          ) : (
            advanceSales.map((advanceSale) => (
              <TableRow key={advanceSale.id}>
                <TableCell className="font-medium">
                  {advanceSale.sale.reference}
                </TableCell>
                <TableCell>{formatDate(advanceSale.createdAt)}</TableCell>
                <TableCell>{formatDate(advanceSale.updatedAt)}</TableCell>
                <TableCell>
                  <AdvanceSaleStatusTag status={advanceSale.status} />
                </TableCell>
                <TableCell>
                  {advanceSale.client ? (
                    getClientLabel(advanceSale.client)
                  ) : (
                    <span className="text-muted-foreground">Non Spécifié</span>
                  )}
                </TableCell>
                <TableCell>
                  {formatCurrency(
                    advanceSale.sale.totalAmount -
                      (advanceSale.sale.discountAmount ?? 0)
                  )}
                </TableCell>
                <TableCell>{formatCurrency(advanceSale.paidAmount)}</TableCell>
                <TableCell>
                  {formatCurrency(
                    advanceSale.sale.totalAmount -
                      (advanceSale.sale.discountAmount ?? 0) -
                      (advanceSale.paidAmount ?? 0)
                  )}
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <CheckPermission
                      requiredPermission={Permission.SALE_VIEW}
                      grantedPermissions={user?.permissions}
                    >
                      <ViewAction href={`/advance-sales/${advanceSale.id}`} />
                    </CheckPermission>
                    <CheckPermission
                      requiredPermission={Permission.SALE_EDIT}
                      grantedPermissions={user?.permissions}
                    >
                      <UpdateAction
                        disabled={
                          advanceSale.status === AdvanceSaleStatus.CANCELED
                        }
                        tooltipMessage="Impossible de modifier la vente annulée"
                        href={`/advance-sales/${advanceSale.id}/edit`}
                      />
                    </CheckPermission>
                    <CheckPermission
                      requiredPermission={Permission.SALE_DELETE}
                      grantedPermissions={user?.permissions}
                    >
                      <DeleteAdvanceSaleDialog
                        advanceSale={advanceSale}
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
