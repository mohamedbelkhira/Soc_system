import React, { useEffect, useState } from "react";
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
  amount: z.number().min(1, "Le montant doit être supérieur à 0"),
});

interface FullPurchaseFee {
  purchaseFeeId: string;
  amount: number;
  feeName: string;
}

export function UpdateAddPurchaseFeeDialog({
  onAdd,
}: {
  onAdd?: (fee: FullPurchaseFee) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [purchaseFeeTypes, setPurchaseFeeTypes] = useState<
    { value: string; label: string }[]
  >([]);
  const [rawFeeTypes, setRawFeeTypes] = useState<
    { id: string; name: string }[]
  >([]);

  useEffect(() => {
    const fetchPurchaseFeeTypes = async () => {
      try {
        const response = await purchaseFeesApi.getAll();
        if (response.status === "success") {
          setRawFeeTypes(response.data);
          setPurchaseFeeTypes(
            response.data.map((fee) => ({
              value: fee.id,
              label: fee.name,
            }))
          );
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
      amount: 0,
    },
  });

  const onSubmit = (values: z.infer<typeof addPurchaseFeeSchema>) => {
    setIsSubmitting(true);
    try {
      const feeType = rawFeeTypes.find((t) => t.id === values.purchaseFeeId);
      const feeName = feeType ? feeType.name : "Type inconnu";

      onAdd?.({
        purchaseFeeId: values.purchaseFeeId,
        amount: values.amount,
        feeName,
      });
      form.reset();
      setIsOpen(false);
    } catch (error) {
      console.log("erreur", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomDialog
      trigger={<AddButton label="Ajouter un frais" />}
      title="Ajouter un Frais d'Achat"
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <Form {...form}>
        <div className="space-y-4">
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
        </div>
      </Form>
    </CustomDialog>
  );
}

export default UpdateAddPurchaseFeeDialog;
