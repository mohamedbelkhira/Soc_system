import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import AddIcon from "@/components/common/AddIcon";
import FormActionButtons from "@/components/common/FormActionButtons";
import NumberField from "@/components/common/fields/NumberField";
import SearchableSelectField from "@/components/common/fields/SearchableSelectField";
import TwoColumns from "@/components/common/layouts/TwoColumns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { CreateClientDialog } from "@/pages/client/create/CreateClientDialog";
import { useClients } from "@/swr/client/client.swr";
import { useLocations } from "@/swr/location.swr";
import { useActiveProducts } from "@/swr/products/product.swr";
import getClientLabel from "@/utils/getClientLabel";
import { useCurrentEmployee } from "@/utils/useCurrentEmployee";

import SaleItemsTable from "../../shared/SaleItemsTable";
import { AddSaleItemDialog } from "../../shared/addSaleItemDialog/AddSaleItemDialog";
import AdvanceSaleSummary from "../shared/AdvanceSaleSummary";
import useCreateAdvanceSaleForm from "./useCreateAdvanceSaleForm";

export default function CreateAdvanceSalePage() {
  const navigate = useNavigate();
  const { locations } = useLocations();
  const { data: clients } = useClients();
  const { data: products } = useActiveProducts();

  const { employee } = useCurrentEmployee();

  const {
    form,
    onSubmit,
    isSubmitting,
    handleSaleItemsAdd,
    saleItems,
    totalAmount,
    totalCost,
    discountAmount,
    paidAmount,
    remove,
  } = useCreateAdvanceSaleForm(() => navigate("/advance-sales"));

  useEffect(() => {
    if (employee) form.setValue("sale.employeeId", employee.id);
  }, [form, employee]);
  useEffect(() => {
    if (locations && locations[0]) {
      form.setValue("sale.locationId", locations[0].id);
    }
  }, [form, locations]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Créer une nouvelle vente avec avance</CardTitle>
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

              <NumberField
                control={form.control}
                max={totalAmount - discountAmount}
                name="paidAmount"
                label="Montant payé"
                placeholder=""
              />
            </TwoColumns>

            <Separator />

            <AdvanceSaleSummary
              totalAmount={totalAmount}
              totalCost={totalCost}
              discountAmount={discountAmount}
              paidAmount={paidAmount}
            />

            <FormActionButtons
              onClose={() => navigate("/advance-sales")}
              isSubmitting={isSubmitting}
              submitLabel={"Créer la vente"}
              submittingLabel={"Création en cours..."}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
