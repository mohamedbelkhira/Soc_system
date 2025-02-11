import React from "react";
import { Control, useController } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { CreateFullPurchaseDTO } from "@/types/createPurchase.dto";

import AddPurchaseFeeDialog, { PurchaseFee } from "./AddPurchaseFeeDialog";
import AppliedPurchaseFeesTable from "./AppliedPurchaseFeesTable";

interface AppliedPurchaseFeesSectionProps {
  control: Control<CreateFullPurchaseDTO>;
}

const AppliedPurchaseFeesSection: React.FC<AppliedPurchaseFeesSectionProps> = ({
  control,
}) => {
  const { field } = useController({
    control,
    name: "appliedFees",
    defaultValue: [],
  });

  const handleFeesAdded = (newFee: PurchaseFee) => {
    field.onChange([...field.value, newFee]);
  };

  const handleRemoveFee = (index: number) => {
    const updatedFees = field.value.filter((_, i) => i !== index);
    field.onChange(updatedFees);
  };

  return (
    <FormField
      control={control}
      name="appliedFees"
      render={() => (
        <FormItem>
          <FormControl>
            <div className="w-full">
              <div className="flex flex-row items-center justify-between">
                <h2 className="font-medium">Liste des frais supplémentaire appliqué</h2>
                <AddPurchaseFeeDialog onAdd={handleFeesAdded} />
              </div>
              <div className="mt-6">
                <AppliedPurchaseFeesTable
                  fees={field.value}
                  onRemoveFee={handleRemoveFee}
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

export default AppliedPurchaseFeesSection;
