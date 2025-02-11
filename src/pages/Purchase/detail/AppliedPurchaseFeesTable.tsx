import React from "react";

import TableWrapper from "@/components/common/TableWrapper";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AppliedPurchaseFee } from "@/types/appliedPurchaseFee.dto";

interface AppliedPurchaseFeesTableProps {
  appliedFees: AppliedPurchaseFee[];
}

const AppliedPurchaseFeesTable: React.FC<AppliedPurchaseFeesTableProps> = ({
  appliedFees,
}) => {
  return (
    <TableWrapper>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type de Frais</TableHead>
            <TableHead>Montant</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appliedFees.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2} className="text-center">
                Aucun frais appliqué à cet achat.
              </TableCell>
            </TableRow>
          ) : (
            appliedFees.map((fee) => (
              <TableRow key={fee.id}>
                <TableCell>{fee.purchaseFee.name}</TableCell>
                <TableCell>{fee.amount} DA</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableWrapper>
  );
};

export default AppliedPurchaseFeesTable;
