import { useEffect } from "react";
import { useParams } from "react-router-dom";

import ButtonGroup from "@/components/common/ButtonGroup";
import DeleteButton from "@/components/common/DeleteButton";
import Page from "@/components/common/Page";
import UpdateButton from "@/components/common/UpdateButton";
import { Skeleton } from "@/components/ui/skeleton";
import { StoreSaleStatus } from "@/schemas/sales/store-sale.schema";
import { useStoreSale } from "@/swr/sales/store-sale.swr";
import stockMovementItemsToSaleItems from "@/utils/adapters/stockMovementsItemToSaleItems";
import handleError from "@/utils/handleError";

import ClientSection from "../../shared/sections/ClientSection";
import SoldItemsSection from "../../shared/sections/SoldItemsSection";
import DeleteStoreSaleDialog from "../delete/DeleteStoreSaleDialog";
import StoreSaleDetailsSection from "./StoreSaleDetailsSection";

export default function StoreSaleDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: storeSale, isLoading, error } = useStoreSale(id!);

  useEffect(() => {
    if (error) {
      handleError(error, "Erreur lors du chargement de vente en magasin");
    }
  }, [error]);

  if (isLoading) {
    return (
      <Page>
        <Skeleton className="h-[400px]" />
        <Skeleton className="h-[400px]" />
      </Page>
    );
  }

  if (!storeSale) {
    return null;
  }

  return (
    <Page
      title={`Vente en magasin "${storeSale.sale.reference}"`}
      backButtonHref="/store-sales"
      actions={
        <ButtonGroup>
          <UpdateButton
            label="Mettre à jour"
            href={`/store-sales/${storeSale.id}/edit`}
            disabled={storeSale.status === StoreSaleStatus.CANCELED}
            tooltipMessage="Impossible de modifier la vente annulée"
          />
          <DeleteStoreSaleDialog
            storeSale={storeSale}
            trigger={<DeleteButton label="Supprimer" />}
          />
        </ButtonGroup>
      }
    >
      <StoreSaleDetailsSection storeSale={storeSale} />
      {storeSale.client && <ClientSection client={storeSale.client} />}
      <SoldItemsSection
        saleItems={stockMovementItemsToSaleItems(
          storeSale.sale.stockMovement.items
        )}
      />
    </Page>
  );
}
