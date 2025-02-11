import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import OnlineSaleCompleteSummary from "../OnlineSaleCompleteSummary";
import { OnlineSale } from "@/types/sales/online-sale.dto";

export default function SaleSummarySection({
  onlineSale,
}: {
  onlineSale: OnlineSale;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Détails de la vente</CardTitle>
      </CardHeader>
      <CardContent>
        <OnlineSaleCompleteSummary onlineSale={onlineSale} />
      </CardContent>
    </Card>
  );
}
