import InformationCard from "@/components/common/InformationCard";
import TwoColumns from "@/components/common/layouts/TwoColumns";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { DollarSign, HandCoins, Percent, Wallet } from "lucide-react";

export default function AdvanceSaleSummary({
  totalAmount,
  totalCost,
  discountAmount,
  paidAmount,
}: {
  totalAmount: number;
  totalCost: number;
  discountAmount: number;
  paidAmount: number;
}) {
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
        icon={Percent}
        label="Montant payé"
        value={formatCurrency(paidAmount)}
      />

      <InformationCard
        icon={Percent}
        label="Reste à payer"
        value={formatCurrency(totalAmount - discountAmount - paidAmount)}
      />

      <InformationCard
        icon={Wallet}
        label="Coût total"
        value={formatCurrency(totalCost)}
      />

      <InformationCard
        icon={HandCoins}
        label="Bénéfice net"
        scheme={
          totalAmount - discountAmount - totalCost >= 0 ? "success" : "danger"
        }
        value={formatCurrency(totalAmount - discountAmount - totalCost)}
      />
    </TwoColumns>
  );
}
