import React, { useMemo } from "react";

import InformationCard from "@/components/common/InformationCard";
import TwoColumns from "@/components/common/layouts/TwoColumns";
import { OnlineSale } from "@/types/sales/online-sale.dto";
import stockMovementItemsToSaleItems from "@/utils/adapters/stockMovementsItemToSaleItems";
import calculateTotalCostForSaleItems from "@/utils/calculateTotalCostForSaleItems";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { formatDate } from "@/utils/formatters/formatDate";
import getOnlineSaleStatusIcon from "@/utils/status-transformers/online-sale/getOnlineSaleStatusIcon";
import getOnlineSaleStatusLabel from "@/utils/status-transformers/online-sale/getOnlineSaleStatusLabel";
import getOnlineSaleStatusScheme from "@/utils/status-transformers/online-sale/getOnlineSaleStatusScheme";
import {
  Calendar,
  Check,
  DollarSign,
  HandCoins,
  Truck,
  Undo2,
  User,
  Wallet,
  X,
} from "lucide-react";

export default function OnlineSaleCompleteSummary({
  onlineSale,
}: {
  onlineSale: OnlineSale;
}) {
  const calculatedData = useMemo(() => {
    const { sale } = onlineSale;
    const saleItems = stockMovementItemsToSaleItems(sale.stockMovement.items);
    const totalCost = calculateTotalCostForSaleItems(saleItems);
    const discountAmount = sale.discountAmount ?? 0;
    const totalAmount = sale.totalAmount;
    const netProfit = totalAmount - totalCost;

    return {
      totalCost,
      discountAmount,
      remainingAmount: totalAmount - discountAmount,
      netProfit,
    };
  }, [onlineSale]);

  if (!onlineSale) {
    return null;
  }

  const { sale, status } = onlineSale;
  const { employee } = sale;
  const fullName = `${employee.firstName} ${employee.lastName}`;

  return (
    <TwoColumns>
      <InformationCard
        icon={Calendar}
        label="Créé à"
        value={formatDate(onlineSale.createdAt)}
      />

      {onlineSale.completedAt && (
        <InformationCard
          icon={Check}
          label={"Vendu à"}
          value={formatDate(onlineSale.completedAt)}
        />
      )}

      {onlineSale.returnedAt && (
        <InformationCard
          icon={Undo2}
          label={"Retour à"}
          value={formatDate(onlineSale.returnedAt)}
        />
      )}

      {onlineSale.canceledAt && (
        <InformationCard
          icon={X}
          label={"Annulé à"}
          value={formatDate(onlineSale.canceledAt)}
        />
      )}

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

      {onlineSale.deliveryHandler && (
        <>
          <InformationCard
            icon={Truck}
            label="Frais de livraison"
            value={formatCurrency(onlineSale.deliveryCost)}
          />
          <InformationCard
            icon={Undo2}
            label="Coût de retour"
            value={formatCurrency(onlineSale.returnCost)}
          />
        </>
      )}
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
        scheme={getOnlineSaleStatusScheme(status)}
        icon={getOnlineSaleStatusIcon(status)}
        label="Statut"
        value={getOnlineSaleStatusLabel(status)}
      />
    </TwoColumns>
  );
}
