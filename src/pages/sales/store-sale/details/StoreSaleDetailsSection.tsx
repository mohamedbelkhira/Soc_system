import React from "react";

import InformationCard from "@/components/common/InformationCard";
import TwoColumns from "@/components/common/layouts/TwoColumns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StoreSaleStatus } from "@/schemas/sales/store-sale.schema";
import { StoreSale } from "@/types/sales/store-sale.dto";
import stockMovementItemsToSaleItems from "@/utils/adapters/stockMovementsItemToSaleItems";
import calculateTotalCostForSaleItems from "@/utils/calculateTotalCostForSaleItems";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { formatDate } from "@/utils/formatters/formatDate";
import getStoreSaleStatusIcon from "@/utils/status-transformers/store-sale/getStoreSaleStatusIcon";
import getStoreSaleStatusLabel from "@/utils/status-transformers/store-sale/getStoreSaleStatusLabel";
import getStoreSaleStatusScheme from "@/utils/status-transformers/store-sale/getStoreSaleStatusScheme";
import {
  Calendar,
  Check,
  DollarSign,
  HandCoins,
  User,
  Wallet,
  X,
} from "lucide-react";

export default function StoreSaleDetailsSection({
  storeSale,
}: {
  storeSale: StoreSale;
}) {
  const saleItems = React.useMemo(
    () => stockMovementItemsToSaleItems(storeSale.sale.stockMovement.items),
    [storeSale.sale.stockMovement.items]
  );

  const totalCost = React.useMemo(
    () => calculateTotalCostForSaleItems(saleItems),
    [saleItems]
  );

  const netProfit = React.useMemo(
    () => storeSale.sale.totalAmount - totalCost,
    [storeSale.sale.totalAmount, totalCost]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Détails de la vente</CardTitle>
      </CardHeader>
      <CardContent>
        <TwoColumns>
          <InformationCard
            icon={Calendar}
            label={"Créé à"}
            value={formatDate(storeSale?.createdAt)}
          />

          {storeSale?.completedAt && (
            <InformationCard
              icon={Check}
              label={"Vendu à"}
              value={formatDate(storeSale?.completedAt)}
            />
          )}
          {storeSale?.canceledAt && (
            <InformationCard
              icon={Check}
              label={"Annulé à"}
              value={formatDate(storeSale?.canceledAt)}
            />
          )}

          <InformationCard
            icon={User}
            label={"Créé par"}
            value={`${storeSale.sale.employee.firstName} ${storeSale.sale.employee.lastName}`}
          />

          <InformationCard
            icon={DollarSign}
            label={"Montant Totale"}
            value={formatCurrency(storeSale?.sale.totalAmount ?? 0)}
          />

          {storeSale?.sale.discountAmount && (
            <InformationCard
              icon={DollarSign}
              label={"Montant de Remise"}
              value={formatCurrency(storeSale.sale.discountAmount ?? 0)}
            />
          )}

          <InformationCard
            icon={HandCoins}
            label={"Montant Payé"}
            value={formatCurrency(
              storeSale?.sale.totalAmount - (storeSale.sale.discountAmount ?? 0)
            )}
          />

          <InformationCard
            icon={Wallet}
            label={"Coût total"}
            value={formatCurrency(totalCost)}
          />

          <InformationCard
            scheme={netProfit > 0 ? "success" : "danger"}
            icon={storeSale.status === StoreSaleStatus.COMPLETED ? Check : X}
            label={"Bénéfice net"}
            value={formatCurrency(netProfit)}
          />

          <InformationCard
            scheme={getStoreSaleStatusScheme(storeSale.status)}
            icon={getStoreSaleStatusIcon(storeSale.status)}
            label={"Statut"}
            value={getStoreSaleStatusLabel(storeSale.status)}
          />
        </TwoColumns>
      </CardContent>
    </Card>
  );
}
