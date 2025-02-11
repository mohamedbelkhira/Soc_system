import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import FormActionButtons from "@/components/common/FormActionButtons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { updatePurchaseFullSchema } from "@/schemas/createPurchase.schema";
import { useLocations } from "@/swr/location.swr";
import { usePurchase, useUpdatePurchase } from "@/swr/purchase.swr";
import { UpdatePurchaseFullDTO } from "@/types/createPurchase.dto";
import { Variant } from "@/types/variant.dto";
import handleError from "@/utils/handleError";
import { showToast } from "@/utils/showToast";
import { zodResolver } from "@hookform/resolvers/zod";

import UpdatePurchaseMetadataForm from "./UpdatePurchaseMetadataForm";
import UpdateVariantsSection from "./UpdateVariantsSection";
import UpdateAppliedPurchaseFeesSection from "./appliedPurchases/UpdateAppliedPurchaseFeesSection";

export type PurchaseState = "ORDERED" | "RECEIVED" | "CANCELED" | undefined;

export interface PurchaseFeeType {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

export interface PurchaseFee {
  id?: string;
  purchaseId?: string;
  purchaseFeeId: string;
  amount: number;
  purchaseFee: PurchaseFeeType; // full object from backend
}

export interface FullPurchaseFee {
  id?: string;
  purchaseId?: string;
  purchaseFeeId: string;
  amount: number;
  feeName: string; // we store only the name here, not the entire purchaseFee
}

export interface PurchaseItem {
  id?: string;
  purchaseId?: string;
  variantId: string;
  quantity: number;
  unitCost: string | number;
  variant: Variant;
}

export interface FullPurchaseItem extends Omit<PurchaseItem, "unitCost"> {
  unitCost: number;
}

export interface Purchase {
  id: string;
  supplierId: string;
  locationId: string;
  description: string;
  state: PurchaseState;
  orderedAt?: string;
  receivedAt?: string;
  canceledAt?: string;
  totalAmount: number;
  purchaseItems: PurchaseItem[];
  appliedFees: PurchaseFee[];
}

const validatePurchaseState = (state: string): PurchaseState => {
  const allowedStates: PurchaseState[] = [
    "ORDERED",
    "RECEIVED",
    "CANCELED",
    undefined,
  ];
  return allowedStates.includes(state as PurchaseState)
    ? (state as PurchaseState)
    : undefined;
};

export default function UpdatePurchasePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Load purchase data
  const {
    data: purchaseData,
    isLoading: isLoadingPurchase,
    error: fetchError,
  } = usePurchase(id ?? "");

  // Hook for updating the purchase
  const {
    updatePurchase,
    isLoading: isUpdating,
    error: updateError,
  } = useUpdatePurchase(id ?? "");

  // Locations
  const { locations } = useLocations();
  const selectedLocation = locations?.[0];

  // Setup react-hook-form
  const form = useForm<UpdatePurchaseFullDTO>({
    resolver: zodResolver(updatePurchaseFullSchema),
    defaultValues: {
      supplierId: "",
      locationId: selectedLocation?.id ?? "",
      description: "",
      state: undefined,
      orderedAt: undefined,
      receivedAt: undefined,
      canceledAt: undefined,
      totalAmount: 0,
      purchaseItems: [],
      appliedFees: [],
    },
    mode: "onSubmit",
  });

  // Once purchase data is loaded, populate the form
  useEffect(() => {
    if (purchaseData && selectedLocation) {
      const formPurchaseItems =
        purchaseData.purchaseItems?.map((item) => ({
          id: item.id,
          purchaseId: item.purchaseId,
          variantId: item.variantId,
          quantity: item.quantity,
          unitCost: parseFloat(String(item.unitCost)),
          variant: item.variant,
        })) ?? [];

      const formAppliedFees =
        purchaseData.appliedFees?.map((fee) => ({
          id: fee.id,
          purchaseId: fee.purchaseId,
          purchaseFeeId: fee.purchaseFeeId,
          amount: parseFloat(String(fee.amount)),
        })) ?? [];

      form.reset({
        id: purchaseData.id,
        supplierId: purchaseData.supplierId,
        locationId: selectedLocation.id,
        description: purchaseData.description,
        state: validatePurchaseState(purchaseData.state),
        orderedAt: purchaseData.orderedAt || undefined,
        receivedAt: purchaseData.receivedAt || undefined,
        canceledAt: purchaseData.canceledAt || undefined,
        totalAmount: parseFloat(String(purchaseData.totalAmount)),
        purchaseItems: formPurchaseItems,
        appliedFees: formAppliedFees,
      });
    }
  }, [purchaseData, selectedLocation, form]);

  // Handle fetch/update errors
  useEffect(() => {
    if (fetchError) {
      handleError(fetchError, "Échec du chargement de l'achat");
      navigate("/purchases");
    }
    if (updateError) {
      // handleError(updateError, "Échec de la mise à jour de l'achat");
    }
  }, [fetchError, updateError, navigate]);

  // Submit handler
  const onSubmit = async (values: UpdatePurchaseFullDTO) => {
    if (!id) return;
    try {
      const response = await updatePurchase(values);
      showToast("success", response.message);
      navigate("/purchases");
    } catch (error) {
      console.error("Error during update:", error);
      handleError(error, "erreur");
    }
  };

  // Show loading
  if (isLoadingPurchase) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chargement de l'achat...</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Veuillez patienter...</p>
        </CardContent>
      </Card>
    );
  }

  // If no purchase found
  if (!purchaseData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chargement de l'achat et des types de frais...</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Veuillez patienter...</p>
        </CardContent>
      </Card>
    );
  }

  // Build the new array that includes feeName
  const initialFullFees: FullPurchaseFee[] =
    purchaseData.appliedFees?.map((fee) => {
      const amount = parseFloat(String(fee.amount));
      const feeName = fee.purchaseFee?.name ?? "Type inconnu";

      return {
        id: fee.id,
        purchaseId: fee.purchaseId,
        purchaseFeeId: fee.purchaseFeeId,
        amount,
        feeName,
      };
    }) ?? [];

  // Build the variants array
  const initialVariants: FullPurchaseItem[] =
    purchaseData.purchaseItems?.map((item) => ({
      id: item.id,
      purchaseId: item.purchaseId,
      variantId: item.variantId,
      quantity: item.quantity,
      unitCost: parseFloat(String(item.unitCost)),
      variant: item.variant,
    })) ?? [];

  // Render the update form
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mettre à jour l'achat</CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <UpdatePurchaseMetadataForm control={form.control} />

            <Separator />
            <UpdateVariantsSection
              control={form.control}
              initialVariants={initialVariants}
            />

            <Separator />
            <UpdateAppliedPurchaseFeesSection
              control={form.control}
              initialFees={initialFullFees}
            />

            <FormActionButtons
              onClose={() => navigate("/purchases")}
              isSubmitting={isUpdating}
              submitLabel="Mettre à jour"
              submittingLabel="Mise à jour..."
            />
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
