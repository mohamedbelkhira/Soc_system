import React, { useMemo } from "react";
import { Calendar, DollarSign, HandCoins, User, Wallet } from "lucide-react";

import InformationCard from "@/components/common/InformationCard";
import TwoColumns from "@/components/common/layouts/TwoColumns";
import { AdvanceSale } from "@/types/sales/advance-sale.dto";

import { formatDate } from "@/utils/formatters/formatDate";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import stockMovementItemsToSaleItems from "@/utils/adapters/stockMovementsItemToSaleItems";
import calculateTotalCostForSaleItems from "@/utils/calculateTotalCostForSaleItems";
import getAdvanceSaleStatusLabel from "@/utils/status-transformers/advance-sale/getAdvanceSaleStatusLabel";
import getAdvanceSaleStatusIcon from "@/utils/status-transformers/advance-sale/getAdvanceSaleStatusIcon";
import getAdvanceSaleStatusScheme from "@/utils/status-transformers/advance-sale/getAdvanceSaleStatusScheme";

export default function AdvanceSaleCompleteSummary({
  advanceSale,
}: {
  advanceSale: AdvanceSale;
}) {
  const calculatedData = useMemo(() => {
    const { sale, paidAmount } = advanceSale;
    const saleItems = stockMovementItemsToSaleItems(sale.stockMovement.items);
    const totalCost = calculateTotalCostForSaleItems(saleItems);
    const discountAmount = sale.discountAmount ?? 0;
    const totalAmount = sale.totalAmount;
    const netProfit = totalAmount - totalCost;

    return {
      totalCost,
      discountAmount,
      remainingAmount: totalAmount - discountAmount - paidAmount,
      netProfit,
    };
  }, [advanceSale]);

  if (!advanceSale) {
    return null;
  }

  const { sale, status } = advanceSale;
  const { employee } = sale;
  const fullName = `${employee.firstName} ${employee.lastName}`;

  return (
    <TwoColumns>
      <InformationCard
        icon={Calendar}
        label="Créé à"
        value={formatDate(advanceSale.createdAt)}
      />

      <InformationCard icon={User} label="Créé par" value={fullName} />

      <InformationCard
        icon={DollarSign}
        label="Montant Totale"
        value={formatCurrency(sale.totalAmount)}
      />

      {calculatedData.discountAmount > 0 && (
        <>
          <InformationCard
            icon={DollarSign}
            label="Montant de Remise"
            value={formatCurrency(calculatedData.discountAmount)}
          />

          <InformationCard
            icon={DollarSign}
            label="Montant à payer"
            value={formatCurrency(
              sale.totalAmount - calculatedData.discountAmount
            )}
          />
        </>
      )}

      <InformationCard
        icon={HandCoins}
        label="Montant Payé"
        value={formatCurrency(advanceSale.paidAmount)}
      />

      <InformationCard
        icon={HandCoins}
        label="Reste à payer"
        value={formatCurrency(calculatedData.remainingAmount)}
      />

      <InformationCard
        icon={Wallet}
        label="Coût total"
        value={formatCurrency(calculatedData.totalCost)}
      />

      <InformationCard
        scheme={calculatedData.netProfit > 0 ? "success" : "danger"}
        icon={HandCoins}
        label="Bénéfice net"
        value={formatCurrency(calculatedData.netProfit)}
      />

      <InformationCard
        scheme={getAdvanceSaleStatusScheme(status)}
        icon={getAdvanceSaleStatusIcon(status)}
        label="Statut"
        value={getAdvanceSaleStatusLabel(status)}
      />
    </TwoColumns>
  );
}
