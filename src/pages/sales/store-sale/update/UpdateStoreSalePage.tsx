import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AddIcon from "@/components/common/AddIcon";
import FormActionButtons from "@/components/common/FormActionButtons";
import DateField from "@/components/common/fields/DateField";
import NumberField from "@/components/common/fields/NumberField";
import SearchableSelectField from "@/components/common/fields/SearchableSelectField";
import SelectField from "@/components/common/fields/SelectField";
import TwoColumns from "@/components/common/layouts/TwoColumns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateClientDialog } from "@/pages/client/create/CreateClientDialog";
import { StoreSaleStatus } from "@/schemas/sales/store-sale.schema";
import { useClients } from "@/swr/client/client.swr";
import { useLocations } from "@/swr/location.swr";
import { useActiveProducts } from "@/swr/products/product.swr";
import getClientLabel from "@/utils/getClientLabel";
import getStoreSaleStatusLabel from "@/utils/status-transformers/store-sale/getStoreSaleStatusLabel";
import { useCurrentEmployee } from "@/utils/useCurrentEmployee";

import SaleItemsTable from "../../shared/SaleItemsTable";
import { AddSaleItemDialog } from "../../shared/addSaleItemDialog/AddSaleItemDialog";
import SaleSummarySection from "../shared/SaleSummarySection";
import useUpdateStoreSaleForm from "./useUpdateStoreSaleForm";

export default function UpdateStoreSalePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { locations, isLoading: isLoadingLocations } = useLocations();
  const { data: clients } = useClients();
  const { data: products } = useActiveProducts();

  const { employee } = useCurrentEmployee();

  const {
    form,
    storeSale,
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
  } = useUpdateStoreSaleForm(id!, () => navigate(`/store-sales/${id}`));

  useEffect(() => {
    if (storeSale && storeSale.status === StoreSaleStatus.CANCELED) {
      navigate(`/store-sales/${storeSale.id}`);
    }
  }, [storeSale, navigate]);

  useEffect(() => {
    if (employee) form.setValue("sale.employeeId", employee.id);
  }, [form, employee]);

  if (isLoadingLocations) {
    return <Skeleton className="h-[400px]" />;
  }

  if (!storeSale) {
    return;
  }

  if (isLoading) {
    return <div>Chargement des détails de la vente...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mettre à jour la vente en magasin</CardTitle>
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
                onRemove={(index) => {
                  handleRemoveSaleItem(index);
                }}
              />
            </div>

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

              <NumberField
                control={form.control}
                max={totalAmount}
                name="sale.discountAmount"
                label="Montant de remise"
                placeholder=""
              />
              <SelectField
                label="Status de vente"
                control={form.control}
                name="status"
                placeholder="Sélectionner un statut"
                options={Object.entries(StoreSaleStatus).map((status) => ({
                  value: status[1],
                  label: getStoreSaleStatusLabel(status[1]),
                }))}
                disabled={storeSale.status === StoreSaleStatus.CANCELED}
              />

              {form.watch("status") === StoreSaleStatus.COMPLETED && (
                <DateField
                  control={form.control}
                  name={"completedAt"}
                  label={"Date de vente"}
                />
              )}

              {form.watch("status") === StoreSaleStatus.CANCELED && (
                <DateField
                  control={form.control}
                  name={"canceledAt"}
                  label={"Date d'annulation"}
                />
              )}
            </TwoColumns>

            <Separator />

            <SaleSummarySection
              totalAmount={totalAmount}
              totalCost={totalCost}
              discountAmount={discountAmount}
            />

            <FormActionButtons
              onClose={() => navigate("/store-sales")}
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
