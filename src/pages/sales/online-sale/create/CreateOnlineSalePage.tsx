import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
import useCreateOnlineSaleForm from "./useCreateOnlineSaleForm";

export default function CreateOnlineSalePage() {
  const navigate = useNavigate();
  const { locations } = useLocations();
  const { data: clients } = useClients();
  const { onlineSaleChannels } = useOnlineSaleChannels();
  const { deliveryHandlers } = useDeliveryHandlers();
  const { data: products } = useActiveProducts();

  const { employee } = useCurrentEmployee();

  const {
    form,
    isCreating,
    onSubmit,
    handleSaleItemsAdd,
    remove,
    saleItems,
    totalAmount,
    totalCost,
    discountAmount,
    deliveryCost,
  } = useCreateOnlineSaleForm(locations[0]?.id, deliveryHandlers, () =>
    navigate("/online-sales")
  );

  useEffect(() => {
    if (employee) form.setValue("sale.employeeId", employee.id);
  }, [form, employee]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Créer une nouvelle vente en ligne</CardTitle>
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
                  onAdd={handleSaleItemsAdd}
                />
              </div>
              <SaleItemsTable
                saleItems={saleItems}
                onRemove={(index) => remove(index)}
              />
            </div>
            <Separator />
            <TwoColumns>
              <div className="flex gap-2 items-end">
                <div className="w-full">
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
                options={[
                  {
                    value: OnlineSaleStatus.COMPLETED,
                    label: getOnlineSaleStatusLabel(OnlineSaleStatus.COMPLETED),
                  },
                  {
                    value: OnlineSaleStatus.PENDING,
                    label: getOnlineSaleStatusLabel(OnlineSaleStatus.PENDING),
                  },
                ]}
              />
              {form.watch("status") === OnlineSaleStatus.COMPLETED && (
                <DateField
                  control={form.control}
                  name="completedAt"
                  label="Date de vente"
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
              onClose={() => {}}
              isSubmitting={isCreating}
              submitLabel={"Créer la vente"}
              submittingLabel={"Création en cours..."}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
