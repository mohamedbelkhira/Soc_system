import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import TableWrapper from "@/components/common/TableWrapper";

interface FullPurchaseFee {
  id?: string;
  purchaseId?: string;
  purchaseFeeId: string;
  amount: number;
  feeName: string;
}

interface AppliedPurchaseFeesTableProps {
  fees: FullPurchaseFee[];
  setFees: (updatedFees: FullPurchaseFee[]) => void;
  onRemoveFee?: (index: number) => void;
}

const UpdateAppliedPurchaseFeesTable: React.FC<AppliedPurchaseFeesTableProps> = ({
  fees,
  setFees,
  onRemoveFee,
}) => {
  const handleRemove = (index: number) => {
    if (onRemoveFee) {
      onRemoveFee(index);
    } else {
      setFees(fees.filter((_, i) => i !== index));
    }
  };

  return (
    <TableWrapper>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type de Frais</TableHead>
          <TableHead>Montant</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fees.length === 0 ? (
          <TableRow>
            <TableCell colSpan={3} className="text-center">
              Aucun frais d'achat ajouté.
            </TableCell>
          </TableRow>
        ) : (
          fees.map((fee, index) => (
            <TableRow key={fee.id || index}>
              <TableCell>{fee.feeName}</TableCell>
              <TableCell>{fee.amount.toFixed(2)} DA</TableCell>
              <TableCell>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleRemove(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
    </TableWrapper>
  );
};

export default UpdateAppliedPurchaseFeesTable;
