import React, { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import FormActionButtons from "@/components/common/FormActionButtons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { createPurchaseFullSchema } from "@/schemas/createPurchase.schema";
import { useLocations } from "@/swr/location.swr";
import { useCreatePurchase } from "@/swr/purchase.swr";
import { CreateFullPurchaseDTO } from "@/types/createPurchase.dto";
import handleError from "@/utils/handleError";
import { showToast } from "@/utils/showToast";
import { zodResolver } from "@hookform/resolvers/zod";

import PurchaseMetadataForm from "./PurchaseMetadataForm";
import AppliedPurchaseFeesSection from "./appliedPurchases/AppliedPurchaseFeesSection";
import VariantsSection from "./variants/VariantsSection";

export default function CreatePurchasePage() {
  const navigate = useNavigate();
  const { locations } = useLocations();
  const { trigger: createPurchase, isLoading, error } = useCreatePurchase();

  // If you always pick the first location
  const selectedLocation = locations?.[0];

  const form = useForm<CreateFullPurchaseDTO>({
    resolver: zodResolver(createPurchaseFullSchema),
    defaultValues: {
      supplierId: "",
      locationId: selectedLocation?.id ?? "",
      description: "",
      state: "ORDERED",
      orderedAt: undefined,
      receivedAt: undefined,
      totalAmount: 0,
      purchaseItems: [],
      appliedFees: [],
    },
    mode: "onSubmit",
  });

  // 1) Watch fields whose changes should update totalAmount
  const purchaseItems = useWatch({ control: form.control, name: "purchaseItems" });
  const appliedFees = useWatch({ control: form.control, name: "appliedFees" });

  // 2) Recalculate totalAmount whenever purchaseItems or appliedFees change
  useEffect(() => {
    const variantsTotal = purchaseItems?.reduce(
      (sum, item) => sum + item.quantity * item.unitCost,
      0
    ) ?? 0;

    const feesTotal = appliedFees?.reduce((sum, fee) => sum + fee.amount, 0) ?? 0;

    form.setValue("totalAmount", variantsTotal + feesTotal);
  }, [purchaseItems, appliedFees, form]);

  useEffect(() => {
    if (error) {
      handleError(error, "Échec de la création de l'achat");
    }
  }, [error]);

  const onSubmit = async (values: CreateFullPurchaseDTO) => {
    try {
      values.locationId = selectedLocation?.id || "";
      const response = await createPurchase(values);
      showToast("success", response.message);
      navigate("/purchases");
    } catch (error) {
      console.error("Error during creation:", error);
      handleError(error, "Échec de la création de l'achat");
    }
  };

  if (!locations || locations.length === 0) {
    return (
      <Card>
        <CardContent>
          Chargement des informations sur les magasins disponible...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Créer un nouvel achat</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <PurchaseMetadataForm control={form.control} />
            <Separator />
            <VariantsSection control={form.control} />
            <Separator />
            <AppliedPurchaseFeesSection control={form.control} />
            <FormActionButtons
              onClose={() => navigate("/purchases")}
              isSubmitting={isLoading}
              submitLabel="Créer"
              submittingLabel="Création"
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
