import InformationCard from "@/components/common/InformationCard";
import TwoColumns from "@/components/common/layouts/TwoColumns";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { DollarSign, HandCoins, Percent, Wallet } from "lucide-react";

export default function SaleSummarySection({
  totalAmount,
  totalCost,
  discountAmount,
}: {
  totalAmount: number;
  totalCost: number;
  discountAmount: number;
}) {
  const netProfit = totalAmount - discountAmount - totalCost;
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
        icon={Wallet}
        label="Coût total"
        value={formatCurrency(totalCost)}
      />
      <InformationCard
        icon={HandCoins}
        label="Bénéfice net"
        value={formatCurrency(netProfit)}
        scheme={netProfit < 0 ? "danger" : "success"}
      />
    </TwoColumns>
  );
}
