import React, { useState } from "react";
import { Control, useController } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
// import { CreateFullPurchaseDTO } from "@/types/createPurchase.dto";
import { UpdatePurchaseFullDTO } from "@/types/createPurchase.dto";
import { Variant } from "@/types/variant.dto";

import UpdateAddVariantDialog from "./UpdateAddVariantDialog";
import UpdateVariantsTable from "./UpdateVariantsTable";

// For submission (no variant field)
interface FormPurchaseItem {
  id?: string;
  purchaseId?: string;
  variantId: string;
  quantity: number;
  unitCost: number;
}

// For display (includes variant)
interface FullPurchaseItem extends FormPurchaseItem {
  variant: Variant;
}

interface UpdateVariantsSectionProps {
  control: Control<UpdatePurchaseFullDTO>;
  initialVariants: FullPurchaseItem[]; // received from UpdatePurchasePage after data load
}

const UpdateVariantsSection: React.FC<UpdateVariantsSectionProps> = ({
  control,
  initialVariants,
}) => {
  const { field } = useController({
    control,
    name: "purchaseItems",
  });

  // Set variants once from initialVariants (full items)
  const [variants, setVariants] = useState<FullPurchaseItem[]>(initialVariants);
  console.log("variants", variants);
  function toMinimalFormItem(v: FullPurchaseItem): FormPurchaseItem {
    return {
      id: v.id,
      variantId: v.variantId,
      quantity: v.quantity,
      unitCost: v.unitCost,
      purchaseId: v.purchaseId,
    };
  }

  const handleVariantsAdded = (newVariants: FullPurchaseItem[]) => {
    const updatedVariants = [...variants, ...newVariants];
    setVariants(updatedVariants);
    field.onChange(updatedVariants.map(toMinimalFormItem));
  };

  const handleRemoveVariant = (index: number) => {
    const updatedVariants = variants.filter((_, i) => i !== index);
    setVariants(updatedVariants);
    field.onChange(updatedVariants.map(toMinimalFormItem));
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

                {control._defaultValues.state !== "RECEIVED" && (
                  <UpdateAddVariantDialog onAdd={handleVariantsAdded} />
                )}
              </div>
              <div className="mt-6">
                <UpdateVariantsTable
                  purchaseState={control._defaultValues.state}
                  variants={variants}
                  setVariants={(updatedVariants) => {
                    setVariants(updatedVariants);
                    field.onChange(updatedVariants.map(toMinimalFormItem));
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

export default UpdateVariantsSection;
