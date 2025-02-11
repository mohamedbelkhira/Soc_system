import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { purchaseFeesApi } from "@/api/purchaseFees.api";
import AddButton from "@/components/common/AddButton";
import CustomDialog from "@/components/common/CustomDialog";
import GenericNumberField from "@/components/common/fields/GenericNumberField";
import SelectField from "@/components/common/fields/SelectField";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { showToast } from "@/utils/showToast";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const addPurchaseFeeSchema = z.object({
  purchaseFeeId: z.string().min(1, "Sélectionnez un type de frais"),
  amount: z.number().min(1, "Le montant doit être  à 0"),
});

export interface PurchaseFee {
  purchaseFeeId: string;
  amount: number;
}

export function AddPurchaseFeeDialog({
  onAdd,
}: {
  onAdd?: (fee: PurchaseFee) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [purchaseFeeTypes, setPurchaseFeeTypes] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    const fetchPurchaseFeeTypes = async () => {
      try {
        const response = await purchaseFeesApi.getAll();
        if (response.status === "success") {
          const feeTypeOptions = response.data.map(
            (fee: { id: string; name: string }) => ({
              value: fee.id,
              label: fee.name,
            })
          );
          setPurchaseFeeTypes(feeTypeOptions);
        }
      } catch (error) {
        showToast("error", "Échec du chargement des types de frais");
        console.error(error);
      }
    };

    fetchPurchaseFeeTypes();
  }, []);

  const form = useForm<z.infer<typeof addPurchaseFeeSchema>>({
    resolver: zodResolver(addPurchaseFeeSchema),
    defaultValues: {
      purchaseFeeId: "",
      amount: 1,
    },
  });

  const onSubmit = (values: z.infer<typeof addPurchaseFeeSchema>) => {
    setIsSubmitting(true);
    try {
      const newFee: PurchaseFee = {
        purchaseFeeId: values.purchaseFeeId,
        amount: values.amount,
      };

      onAdd?.(newFee);
      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error adding fee:", error);
      showToast("error", "Échec de l'ajout du frais");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomDialog
      trigger={<AddButton label="Ajouter un Frais" />}
      title="Ajouter un Frais d'Achat"
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="purchaseFeeId"
            render={({ field }) => (
              <SelectField
                control={form.control}
                label="Type de Frais"
                placeholder="Sélectionner un type de frais"
                options={purchaseFeeTypes}
                {...field}
              />
            )}
          />

          <GenericNumberField
            control={form.control}
            name="amount"
            label="Montant"
          />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={() => form.handleSubmit(onSubmit)()}
            >
              {isSubmitting ? "Ajout..." : "Ajouter"}
            </Button>
          </div>
        </form>
      </Form>
    </CustomDialog>
  );
}

export default AddPurchaseFeeDialog;
