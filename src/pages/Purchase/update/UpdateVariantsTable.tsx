import React from "react";

import InformationCard from "@/components/common/InformationCard";
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
import { Variant } from "@/types/variant.dto";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import getVariantName from "@/utils/getVariantName";
import { Calculator, Trash2 } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import { env } from "@/config/environment";
interface FullPurchaseItem {
  id?: string;
  purchaseId?: string;
  variantId: string;
  quantity: number;
  unitCost: number;
  variant: Variant;
}

interface VariantsTableProps {
  purchaseState?: string;
  variants: FullPurchaseItem[];
  setVariants: (updatedVariants: FullPurchaseItem[]) => void;
  onRemoveVariant?: (index: number) => void;
}
const calculateTotalWeightPrice = (variants: FullPurchaseItem[]): number => {
  
  const totalWeightInGrams = variants.reduce(
    (sum, variant) => sum + (variant.variant.product.weight * variant.quantity),
    0
  );
  console.log("total weight grams", totalWeightInGrams);

  return totalWeightInGrams * 1.5;
};
const UpdateVariantsTable: React.FC<VariantsTableProps> = ({
  purchaseState,
  variants,
  setVariants,
  onRemoveVariant,
}) => {
  console.log('poids env activation', env.ENABLE_PRODUCT_WEIGHT);
  console.log("ENABLE PRODUCT IMAGES", import.meta.env.ENABLE_PRODUCT_IMAGES);
  const totalPrice = variants.reduce(
    (sum, variant) => sum + variant.quantity * variant.unitCost,
    0
  );
  const totalWeightInGrams = variants.reduce(
    (sum, variant) => sum + (variant.variant.product.weight * variant.quantity),
    0
  );
  const totalWeightPrice = calculateTotalWeightPrice(variants);
  const handleRemove = (index: number) => {
    if (onRemoveVariant) {
      onRemoveVariant(index);
    } else {
      setVariants(variants.filter((_, i) => i !== index));
    }
  };

  return (
    <div>
      <TableWrapper>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produit</TableHead>
              <TableHead>Variante</TableHead>
              <TableHead>Quantité</TableHead>
              <TableHead>Coût Unitaire</TableHead>
              <TableHead>Coût Totale</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {variants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Aucun variante ajoutée.
                </TableCell>
              </TableRow>
            ) : (
              variants.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {item.variant.product.brand} - {item.variant.product.name}
                  </TableCell>
                  <TableCell>{getVariantName(item.variant)}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{formatCurrency(item.unitCost)}</TableCell>
                  <TableCell>{formatCurrency(item.unitCost * item.quantity)}</TableCell>
                  <TableCell>
                    {purchaseState !== "RECEIVED" && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableWrapper>

      <div className="mt-4">
        {variants.length > 0 && (
          <div>
          <InformationCard
            icon={Calculator}
            label="Prix Estimé des variants"
            value={formatCurrency(totalPrice)}
          />
          <Separator className="mt-5"/>

          {env.ENABLE_PRODUCT_WEIGHT && (
            <InformationCard
            icon={Calculator}
            label="Prix Estimé du poid des variants"
            secondaryValue={formatCurrency(totalWeightPrice)}
            value={`${totalWeightInGrams}g`}
          />
          )}
        </div>
        )}
      </div>
    </div>
  );
};

export default UpdateVariantsTable;
