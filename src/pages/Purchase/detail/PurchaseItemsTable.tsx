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
import { PurchaseItem } from "@/types/purchaseItem.dto";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import getVariantName from "@/utils/getVariantName";

interface PurchaseItemsTableProps {
  purchaseItems: PurchaseItem[];
}

const PurchaseItemsTable: React.FC<PurchaseItemsTableProps> = ({
  purchaseItems,
}) => {
  return (
    <TableWrapper>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produit</TableHead>
            <TableHead>Variante</TableHead>
            <TableHead>Quantité</TableHead>
            <TableHead>Coût Unitaire</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchaseItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Aucun article dans cet achat
              </TableCell>
            </TableRow>
          ) : (
            purchaseItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.variant.product.name} - {item.variant.product.brand}
                </TableCell>
                <TableCell>
                  {item.variant.product.hasVariants
                    ? getVariantName(item.variant)
                    : "-"}
                </TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{formatCurrency(item.unitCost)}</TableCell>
                <TableCell>
                  {formatCurrency(item.quantity * item.unitCost)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableWrapper>
  );
};

export default PurchaseItemsTable;
