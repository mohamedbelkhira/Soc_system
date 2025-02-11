import { useEffect } from "react";
import { useParams } from "react-router-dom";

import ButtonGroup from "@/components/common/ButtonGroup";
import DeleteButton from "@/components/common/DeleteButton";
import Page from "@/components/common/Page";
import UpdateButton from "@/components/common/UpdateButton";
import { Skeleton } from "@/components/ui/skeleton";
import { AdvanceSaleStatus } from "@/schemas/sales/advance-sale.schema";
import { useAdvanceSale } from "@/swr/sales/advance-sale.swr";
import stockMovementItemsToSaleItems from "@/utils/adapters/stockMovementsItemToSaleItems";
import handleError from "@/utils/handleError";

import ClientSection from "../../shared/sections/ClientSection";
import SoldItemsSection from "../../shared/sections/SoldItemsSection";
import DeleteAdvanceSaleDialog from "../delete/DeleteAdvanceSaleDialog";
import SaleSummarySection from "./SaleSummarySection";

export default function AdvanceSaleDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: advanceSale, isLoading, error } = useAdvanceSale(id!);

  useEffect(() => {
    if (error) {
      handleError(error, "Erreur lors du chargement de vente avec avance");
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

  if (!advanceSale) {
    return;
  }
  return (
    <Page
      title={`Vente avec avance "${advanceSale.sale.reference}"`}
      backButtonHref="/advance-sales"
      actions={
        <ButtonGroup>
          <UpdateButton
            label="Mettre à jour"
            href={`/advance-sales/${advanceSale.id}/edit`}
            disabled={advanceSale.status === AdvanceSaleStatus.CANCELED}
            tooltipMessage="Impossible de modifier la vente annulée"
          />
          <DeleteAdvanceSaleDialog
            advanceSale={advanceSale}
            trigger={<DeleteButton label="Supprimer" />}
          />
        </ButtonGroup>
      }
    >
      <SaleSummarySection advanceSale={advanceSale} />
      {advanceSale.client && <ClientSection client={advanceSale.client} />}
      <SoldItemsSection
        saleItems={stockMovementItemsToSaleItems(
          advanceSale.sale.stockMovement.items
        )}
      />
    </Page>
  );
}
