import React, { useState } from "react";
import { Control, useController } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { CreateFullPurchaseDTO } from "@/types/createPurchase.dto";
import { Variant } from "@/types/variant.dto";

import AddVariantDialog from "./AddVariantDialog";
import VariantsTable from "./VariantsTable";

interface VariantItem {
  variant: Variant;
  quantity: number;
  unitCost: number;
  variantId: string;
}

interface VariantsSectionProps {
  control: Control<CreateFullPurchaseDTO>;
}

const VariantsSection: React.FC<VariantsSectionProps> = ({ control }) => {
  const { field } = useController({
    control,
    name: "purchaseItems",
  });

  const [variants, setVariants] = useState<VariantItem[]>([]);

  const handleVariantsAdded = (newVariants: VariantItem[]) => {
    setVariants((prev) => [...prev, ...newVariants]);
    // Extract minimal form data from new variants
    const updatedPurchaseItems = [
      ...field.value,
      ...newVariants.map(({ variantId, quantity, unitCost }) => ({
        variantId,
        quantity,
        unitCost,
      })),
    ];
    field.onChange(updatedPurchaseItems);
  };

  const handleRemoveVariant = (index: number) => {
    const updatedVariants = variants.filter((_, i) => i !== index);
    setVariants(updatedVariants);
    // Sync minimal form data
    const updatedPurchaseItems = updatedVariants.map((v) => ({
      variantId: v.variantId,
      quantity: v.quantity,
      unitCost: v.unitCost,
    }));
    field.onChange(updatedPurchaseItems);
  };

  return (
    <FormField
      control={control}
      name="purchaseItems"
      render={() => (
        <FormItem>
          <FormControl>
            <div className="w-full">
              <div className="flex flex-row items-center justify-between">
                <h2 className="font-medium">Liste des Variantes</h2>
                <AddVariantDialog onAdd={handleVariantsAdded} />
              </div>
              <div className="mt-6">
                <VariantsTable
                  variants={variants}
                  setVariants={(updatedVariants) => {
                    setVariants(updatedVariants); // This is allowed because updatedVariants is now guaranteed to be an array
                    const updatedPurchaseItems = updatedVariants.map(
                      (v: VariantItem) => ({
                        variantId: v.variantId,
                        quantity: v.quantity,
                        unitCost: v.unitCost,
                      })
                    );
                    field.onChange(updatedPurchaseItems);
                  }}
                  onRemoveVariant={handleRemoveVariant}
                />
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default VariantsSection;
