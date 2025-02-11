import InformationCard from "@/components/common/InformationCard";
import TwoColumns from "@/components/common/layouts/TwoColumns";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { DollarSign, HandCoins, Percent, Truck, Wallet } from "lucide-react";

export default function OnlineSaleSummary({
  totalAmount,
  totalCost,
  discountAmount,
  deliveryCost,
}: {
  totalAmount: number;
  totalCost: number;
  discountAmount: number;
  deliveryCost: number;
}) {
  const netBenefit = totalAmount - discountAmount - totalCost;
  return (
    <TwoColumns>
      <InformationCard
        icon={DollarSign}
        label="Montant Total"
        value={formatCurrency(totalAmount)}
      />

      <InformationCard
        icon={Percent}
        label="Montant à payer"
        value={formatCurrency(totalAmount - discountAmount)}
      />

      <InformationCard
        icon={Truck}
        label="Frais de livraison"
        value={formatCurrency(deliveryCost)}
      />

      <InformationCard
        icon={Wallet}
        label="Coût total"
        value={formatCurrency(totalCost)}
      />

      <InformationCard
        scheme={netBenefit > 0 ? "success" : "danger"}
        icon={HandCoins}
        label="Bénéfice net"
        value={formatCurrency(netBenefit)}
      />
    </TwoColumns>
  );
}
