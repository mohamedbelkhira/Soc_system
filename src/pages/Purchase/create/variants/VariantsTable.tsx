import React from "react";
import { env } from "@/config/environment";
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
import { Calculator, Trash2 } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";

interface VariantItem {
  variant: Variant;
  quantity: number;
  unitCost: number;
  variantId: string;
}

interface VariantsTableProps {
  variants: VariantItem[];
  setVariants: (updatedVariants: VariantItem[]) => void;
  onRemoveVariant: (index: number) => void;
}
const calculateTotalWeightPrice = (variants: VariantItem[]): number => {
  
  const totalWeightInGrams = variants.reduce(
    (sum, variant) => sum + (variant.variant.product.weight * variant.quantity),
    0
  );
  console.log("total weight grams", totalWeightInGrams);

  return totalWeightInGrams * 1.5;
};
const VariantsTable: React.FC<VariantsTableProps> = ({
  variants,
  onRemoveVariant,
}) => {
  console.log("variant", variants);
  const totalPrice = variants.reduce(
    
    (sum, variant) => sum + variant.quantity * variant.unitCost,
    0
  );
  const totalWeightInGrams = variants.reduce(
    (sum, variant) => sum + (variant.variant.product.weight * variant.quantity),
    0
  );
  const totalWeightPrice = calculateTotalWeightPrice(variants);

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
              variants.map((variant, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {variant.variant.product.brand}-
                    {variant.variant.product.name}
                  </TableCell>
                  <TableCell>
                    {variant.variant.product.hasVariants
                      ? variant.variant.attributeValues
                          .map((attr) => attr.value)
                          .join(" - ")
                      : "Produit par défaut"}
                  </TableCell>
                  <TableCell>{variant.quantity}</TableCell>
                  <TableCell>{formatCurrency(variant.unitCost)}</TableCell>
                  <TableCell>{formatCurrency(variant.unitCost * variant.quantity)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveVariant(index)}
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

export default VariantsTable;
