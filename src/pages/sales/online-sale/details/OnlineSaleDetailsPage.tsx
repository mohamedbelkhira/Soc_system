import { useEffect } from "react";
import { useParams } from "react-router-dom";

import ButtonGroup from "@/components/common/ButtonGroup";
import DeleteButton from "@/components/common/DeleteButton";
import Page from "@/components/common/Page";
import UpdateButton from "@/components/common/UpdateButton";
import { Skeleton } from "@/components/ui/skeleton";
import { OnlineSaleStatus } from "@/schemas/sales/online-sale.schema";
import { useOnlineSale } from "@/swr/sales/online-sale.swr";
import stockMovementItemsToSaleItems from "@/utils/adapters/stockMovementsItemToSaleItems";
import handleError from "@/utils/handleError";

import ClientSection from "../../shared/sections/ClientSection";
import SoldItemsSection from "../../shared/sections/SoldItemsSection";
import DeleteOnlineSaleDialog from "../delete/DeleteOnlineSaleDialog";
import DeliveryHandlerSection from "./sections/DeliveryHandlerSection";
import SaleSummarySection from "./sections/SaleSummarySection";

export default function OnlineSaleDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: onlineSale, isLoading, error } = useOnlineSale(id!);

  useEffect(() => {
    if (error) {
      handleError(error, "Erreur lors du chargement de vente en ligne");
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

  if (!onlineSale) {
    return;
  }
  return (
    <Page
      title={`Vente en ligne "${onlineSale.sale.reference}"`}
      backButtonHref="/online-sales"
      actions={
        <ButtonGroup>
          <UpdateButton
            label="Mettre à jour"
            href={`/online-sales/${onlineSale.id}/edit`}
            disabled={
              onlineSale.status === OnlineSaleStatus.CANCELED ||
              onlineSale.status === OnlineSaleStatus.RETURNED
            }
            tooltipMessage="Impossible de modifier la vente annulée ou retournée"
          />
          <DeleteOnlineSaleDialog
            onlineSale={onlineSale}
            trigger={<DeleteButton label="Supprimer" />}
          />
        </ButtonGroup>
      }
    >
      <SaleSummarySection onlineSale={onlineSale} />
      {onlineSale.deliveryHandler && (
        <DeliveryHandlerSection deliveryHandler={onlineSale.deliveryHandler} />
      )}
      {onlineSale.client && <ClientSection client={onlineSale.client} />}
      <SoldItemsSection
        saleItems={stockMovementItemsToSaleItems(
          onlineSale.sale.stockMovement.items
        )}
      />
    </Page>
  );
}
