import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import ButtonGroup from "@/components/common/ButtonGroup";
import DeleteButton from "@/components/common/DeleteButton";
import Page from "@/components/common/Page";
import UpdateButton from "@/components/common/UpdateButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePurchase } from "@/swr/purchase.swr";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { showToast } from "@/utils/showToast";

import DeletePurchaseDialog from "../delete/DeletePurchaseDialog";
import AppliedPurchaseFeesTable from "./AppliedPurchaseFeesTable";
import PurchaseItemsTable from "./PurchaseItemsTable";
import PurchaseMetadataCard from "./PurchaseMetadataCard";

export default function PurchaseDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: purchase, isLoading, error } = usePurchase(id!);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="mx-auto space-y-6">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[400px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  if (error) {
    showToast(
      "error",
      getErrorMessage(error, "Échec du chargement de l'achat")
    );
    navigate("/purchases");
    return null;
  }

  if (!purchase) {
    showToast("error", "Achat non trouvé");
    navigate("/purchases");
    return null;
  }

  return (
    <Page
      title="Détails de l'achat"
      backButtonHref="/purchases"
      actions={
        <ButtonGroup>
          <UpdateButton
            label="Mettre à jour"
            href={`/purchases/${purchase.id}/edit`}
          />
          <DeletePurchaseDialog
            purchase={purchase}
            trigger={<DeleteButton label="Supprimer" />}
          />
        </ButtonGroup>
      }
    >
      <PurchaseMetadataCard purchase={purchase} />

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Articles de l'achat</CardTitle>
        </CardHeader>
        <CardContent>
          <PurchaseItemsTable purchaseItems={purchase.purchaseItems} />
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Frais appliqués</CardTitle>
        </CardHeader>
        <CardContent>
          <AppliedPurchaseFeesTable appliedFees={purchase.appliedFees} />
        </CardContent>
      </Card>
    </Page>
  );
}
