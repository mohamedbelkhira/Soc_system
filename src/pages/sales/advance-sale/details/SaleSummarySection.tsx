import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdvanceSale } from "@/types/sales/advance-sale.dto";

import AdvanceSaleCompleteSummary from "./AdvanceSaleCompleteSummary";

export default function SaleSummarySection({
  advanceSale,
}: {
  advanceSale: AdvanceSale;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Détails de la vente</CardTitle>
      </CardHeader>
      <CardContent>
        <AdvanceSaleCompleteSummary advanceSale={advanceSale} />
      </CardContent>
    </Card>
  );
}
