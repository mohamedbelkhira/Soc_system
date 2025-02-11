import React, { useEffect, useState } from "react";

import { purchaseFeesApi } from "@/api/purchaseFees.api";
import TableWrapper from "@/components/common/TableWrapper";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { showToast } from "@/utils/showToast";
import { Trash2 } from "lucide-react";

import { PurchaseFee } from "./AddPurchaseFeeDialog";

interface AppliedPurchaseFeesTableProps {
  fees: PurchaseFee[];
  onRemoveFee: (index: number) => void;
}

interface PurchaseFeeType {
  id: string;
  name: string;
}

const AppliedPurchaseFeesTable: React.FC<AppliedPurchaseFeesTableProps> = ({
  fees,
  onRemoveFee,
}) => {
  const [feeTypes, setFeeTypes] = useState<PurchaseFeeType[]>([]);

  useEffect(() => {
    const fetchPurchaseFeeTypes = async () => {
      try {
        const response = await purchaseFeesApi.getAll();
        if (response.status === "success") {
          setFeeTypes(response.data);
        }
      } catch (error) {
        showToast("error", "Échec du chargement des types de frais");
        console.error(error);
      }
    };

    fetchPurchaseFeeTypes();
  }, []);

  const getFeeTypeName = (feeId: string) => {
    const feeType = feeTypes.find((type) => type.id === feeId);
    return feeType ? feeType.name : "Type inconnu";
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
              <TableRow key={index}>
                <TableCell>{getFeeTypeName(fee.purchaseFeeId)}</TableCell>
                <TableCell>{fee.amount.toFixed(2)} DA</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveFee(index)}
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

export default AppliedPurchaseFeesTable;
