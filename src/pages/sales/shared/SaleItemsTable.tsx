import TableWrapper from "@/components/common/TableWrapper";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SaleItem } from "@/types/sales/sale-Item.dto";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import getSaleItemSubtotal from "@/utils/getSaleItemSubtotal";
import getSaleItemQuantity from "@/utils/getSaleItemTotalQuantity";

import DeleteSaleItemDialog from "./addSaleItemDialog/DeleteSaleItemDialog";

export default function SaleItemsTable({
  saleItems,
  onRemove,
  mode = "edit",
}: {
  saleItems: SaleItem[];
  onRemove?: (index: number) => void;
  mode?: "view" | "edit";
}) {
  return (
    <TableWrapper>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produit</TableHead>
            <TableHead>Variante</TableHead>
            <TableHead>Prix Unitaire</TableHead>
            <TableHead>Quantité</TableHead>
            <TableHead>Sous Total</TableHead>
            {mode === "edit" && (
              <TableHead className="text-right whitespace-nowrap w-[100px]">
                Actions
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {saleItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={mode === "edit" ? 6 : 5}>
                Aucun article ajouté à la vente.
              </TableCell>
            </TableRow>
          ) : (
            saleItems.map((saleItem, index) => (
              <TableRow key={`${saleItem.productId}-${saleItem.variantId}`}>
                <TableCell className="font-medium whitespace-nowrap">
                  {saleItem.productName}
                </TableCell>
                <TableCell className="font-medium whitespace-nowrap">
                  {saleItem.variantName}
                </TableCell>
                <TableCell>{formatCurrency(saleItem.price)}</TableCell>
                <TableCell>{getSaleItemQuantity(saleItem)}</TableCell>
                <TableCell>
                  {formatCurrency(getSaleItemSubtotal(saleItem))}
                </TableCell>
                {mode === "edit" && (
                  <TableCell className="text-right whitespace-nowrap">
                    <div className="flex justify-end gap-2">
                      <DeleteSaleItemDialog
                        saleItem={saleItem}
                        onDelete={() => {
                          onRemove?.(index);
                        }}
                      />
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableWrapper>
  );
}
