import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AddIcon from "@/components/common/AddIcon";
import FormActionButtons from "@/components/common/FormActionButtons";
import DateField from "@/components/common/fields/DateField";
import NumberField from "@/components/common/fields/NumberField";
import SearchableSelectField from "@/components/common/fields/SearchableSelectField";
import SelectField from "@/components/common/fields/SelectField";
import TextField from "@/components/common/fields/TextField";
import TwoColumns from "@/components/common/layouts/TwoColumns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateClientDialog } from "@/pages/client/create/CreateClientDialog";
import { OnlineSaleStatus } from "@/schemas/sales/online-sale.schema";
import { useClients } from "@/swr/client/client.swr";
import { useDeliveryHandlers } from "@/swr/delivery-handler.swr";
import { useLocations } from "@/swr/location.swr";
import { useActiveProducts } from "@/swr/products/product.swr";
import { useOnlineSaleChannels } from "@/swr/sales/online-sale-channel.swr";
import getClientLabel from "@/utils/getClientLabel";
import getDeliveryHandlerLabel from "@/utils/getDeliveryHandlerLabel";
import getOnlineSaleStatusLabel from "@/utils/status-transformers/online-sale/getOnlineSaleStatusLabel";
import { useCurrentEmployee } from "@/utils/useCurrentEmployee";

import { CreateOnlineSaleChannelDialog } from "../../online-sale-channel/create/CreateOnlineSaleChannelDialog";
import SaleItemsTable from "../../shared/SaleItemsTable";
import { AddSaleItemDialog } from "../../shared/addSaleItemDialog/AddSaleItemDialog";
import OnlineSaleSummary from "../shared/OnlineSaleSummary";
import useUpdateOnlineSaleForm from "./useUpdateOnlineSaleForm";

export default function UpdateOnlineSalePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { locations } = useLocations();
  const { data: clients } = useClients();
  const { onlineSaleChannels } = useOnlineSaleChannels();
  const { deliveryHandlers } = useDeliveryHandlers();
  const { data: products } = useActiveProducts();

  const { employee } = useCurrentEmployee();

  const {
    form,
    onlineSale,
    isLoading,
    isUpdating,
    onSubmit,
    handleAddSaleItem,
    handleRemoveSaleItem,
    removedSaleItems,
    saleItems,
    totalAmount,
    totalCost,
    discountAmount,
    deliveryCost,
  } = useUpdateOnlineSaleForm(id!, deliveryHandlers, () =>
    navigate(`/online-sales/${id}`)
  );

  useEffect(() => {
    if (
      onlineSale &&
      (onlineSale.status === OnlineSaleStatus.RETURNED ||
        onlineSale.status === OnlineSaleStatus.CANCELED)
    ) {
      navigate(`/online-sales/${onlineSale.id}`);
    }
  }, [onlineSale, navigate]);

  useEffect(() => {
    if (employee) form.setValue("sale.employeeId", employee.id);
  }, [form, employee]);

  if (!onlineSale) {
    return null;
  }

  if (isLoading) {
    return <Skeleton className="h-[400px]" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mettre à jour la vente en ligne</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              console.error("Form Validation Errors:", errors);
            })}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="flex justify-end">
                <AddSaleItemDialog
                  locationId={locations[0]?.id}
                  products={products}
                  onAdd={handleAddSaleItem}
                  removedSaleItems={removedSaleItems}
                />
              </div>
              <SaleItemsTable
                saleItems={saleItems}
                onRemove={handleRemoveSaleItem}
              />
            </div>

            <Separator />

            <TwoColumns>
              <div className="flex gap-2 items-end">
                <div className="grow">
                  <SelectField
                    label="Livreur"
                    control={form.control}
                    name="deliveryHandlerId"
                    placeholder="Sélectionner un livreur"
                    options={deliveryHandlers.map((deliveryHandler) => ({
                      value: deliveryHandler.id,
                      label: getDeliveryHandlerLabel(deliveryHandler),
                    }))}
                  />
                </div>
              </div>
              <NumberField
                control={form.control}
                name="deliveryCost"
                label="Frais de livraison"
                placeholder=""
                disabled={!form.watch("deliveryHandlerId")}
              />
              <NumberField
                control={form.control}
                name="returnCost"
                label="Coût de retour"
                placeholder=""
                disabled={!form.watch("deliveryHandlerId")}
              />
              <TextField
                control={form.control}
                name="trackingNumber"
                label="Numéro de suivi"
                placeholder="Saisir le numéro de suivi"
                disabled={!form.watch("deliveryHandlerId")}
              />
            </TwoColumns>

            <Separator />

            <TwoColumns>
              <div className="flex gap-2 items-end">
                <div className="grow">
                  <SearchableSelectField
                    label="Client"
                    control={form.control}
                    name="clientId"
                    placeholder="Sélectionner un client"
                    emptyMessage="Aucun client trouvé"
                    options={clients.map((client) => ({
                      value: client.id,
                      label: getClientLabel(client),
                    }))}
                  />
                </div>
                <CreateClientDialog
                  trigger={<AddIcon />}
                  onSuccess={(clientId) => form.setValue("clientId", clientId)}
                />
              </div>

              <div className="flex gap-2 items-end">
                <div className="grow">
                  <SearchableSelectField
                    label="Canale de vente"
                    control={form.control}
                    name="channelId"
                    placeholder="Sélectionner un canale"
                    options={onlineSaleChannels.map((channel) => ({
                      value: channel.id,
                      label: channel.name,
                    }))}
                  />
                </div>
                <CreateOnlineSaleChannelDialog
                  trigger={<AddIcon />}
                  onSuccess={(channelId) => {
                    form.setValue("channelId", channelId);
                  }}
                />
              </div>

              <SelectField
                label="Status de vente"
                control={form.control}
                name="status"
                placeholder="Sélectionner un statut"
                options={Object.entries(OnlineSaleStatus).map((status) => ({
                  value: status[1],
                  label: getOnlineSaleStatusLabel(status[1]),
                }))}
                disabled={
                  onlineSale.status === OnlineSaleStatus.RETURNED ||
                  onlineSale.status === OnlineSaleStatus.CANCELED
                }
              />
              {form.watch("status") === OnlineSaleStatus.COMPLETED && (
                <DateField
                  control={form.control}
                  name={"completedAt"}
                  label={"Date de vente"}
                />
              )}

              {form.watch("status") === OnlineSaleStatus.RETURNED && (
                <DateField
                  control={form.control}
                  name={"returnedAt"}
                  label={"Date de retour"}
                />
              )}

              {form.watch("status") === OnlineSaleStatus.CANCELED && (
                <DateField
                  control={form.control}
                  name={"canceledAt"}
                  label={"Date d'annulation"}
                />
              )}

              <NumberField
                control={form.control}
                max={totalAmount}
                name="sale.discountAmount"
                label="Montant de remise"
                placeholder=""
              />
            </TwoColumns>

            <Separator />

            <OnlineSaleSummary
              totalAmount={totalAmount}
              totalCost={totalCost}
              discountAmount={discountAmount}
              deliveryCost={deliveryCost}
            />

            <FormActionButtons
              onClose={() => navigate("/online-sales")}
              isSubmitting={isUpdating}
              submitLabel={"Mettre à jour la vente"}
              submittingLabel={"Mise à jour en cours..."}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
