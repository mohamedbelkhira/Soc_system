import React, { useState } from "react";
import { Control, useController } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { UpdatePurchaseFullDTO } from "@/types/createPurchase.dto";

import UpdateAddPurchaseFeeDialog from "./UpdateAddPurchaseFeeDialog";
import UpdateAppliedPurchaseFeesTable from "./UpdateAppliedPurchaseFeesTable";

// Minimal form type
interface FormPurchaseFee {
  id?: string;
  purchaseId?: string;
  purchaseFeeId: string;
  amount: number;
}

// Full type with feeName for display
interface FullPurchaseFee extends FormPurchaseFee {
  feeName: string;
}

interface UpdateAppliedPurchaseFeesProps {
  control: Control<UpdatePurchaseFullDTO>;
  initialFees: FullPurchaseFee[]; // from UpdatePurchasePage
}

const UpdateAppliedPurchaseFeesSection: React.FC<
  UpdateAppliedPurchaseFeesProps
> = ({ control, initialFees }) => {
  const { field } = useController({
    control,
    name: "appliedFees",
  });
  console.log("initial fee", initialFees)
  const [fees, setFees] = useState<FullPurchaseFee[]>(initialFees);
  console.log("fees", fees);
  function toMinimalFormFee(f: FullPurchaseFee): FormPurchaseFee {
    return {
      id: f.id,
      purchaseId: f.purchaseId,
      purchaseFeeId: f.purchaseFeeId,
      amount: f.amount,
    };
  }

  const handleFeesAdded = (newFee: FullPurchaseFee) => {
    const updatedFees = [...fees, newFee];
    setFees(updatedFees);
    field.onChange(updatedFees.map(toMinimalFormFee));
  };

  const handleRemoveFee = (index: number) => {
    const updatedFees = fees.filter((_, i) => i !== index);
    setFees(updatedFees);
    field.onChange(updatedFees.map(toMinimalFormFee));
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

                <UpdateAddPurchaseFeeDialog
                  onAdd={(fee) => {
                    handleFeesAdded(fee);
                  }}
                />
              </div>
              <div className="mt-6">
                <UpdateAppliedPurchaseFeesTable
                  fees={fees}
                  setFees={(updatedFees) => {
                    setFees(updatedFees);
                    field.onChange(updatedFees.map(toMinimalFormFee));
                  }}
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

export default UpdateAppliedPurchaseFeesSection;
