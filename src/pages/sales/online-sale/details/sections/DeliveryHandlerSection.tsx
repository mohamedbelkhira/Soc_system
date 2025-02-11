import InformationCard from "@/components/common/InformationCard";
import TwoColumns from "@/components/common/layouts/TwoColumns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeliveryHandler } from "@/types/deliveryHandler.dto";
import { Building2, MapPinHouse, Phone, User } from "lucide-react";

export default function DeliveryHandlerSection({
  deliveryHandler,
}: {
  deliveryHandler: DeliveryHandler;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Détails du livreur</CardTitle>
      </CardHeader>
      <CardContent>
        <TwoColumns>
          {deliveryHandler.agency && (
            <>
              <InformationCard
                icon={Building2}
                label={"Nom de l'agence"}
                value={deliveryHandler.agency.name}
              />
              <InformationCard
                icon={Phone}
                label={"Numéro de téléphone"}
                value={deliveryHandler.agency.phoneNumber}
              />
              <InformationCard
                icon={MapPinHouse}
                label={"Adresse"}
                value={deliveryHandler.agency.address}
              />
            </>
          )}
          {deliveryHandler.employee && (
            <>
              <InformationCard
                icon={User}
                label={"Nom et Prénom"}
                value={
                  deliveryHandler.employee.firstName +
                  " " +
                  deliveryHandler.employee.lastName
                }
              />
              <InformationCard
                icon={Phone}
                label={"Numéro de téléphone"}
                value={deliveryHandler.employee.phoneNumber}
              />
            </>
          )}
        </TwoColumns>
      </CardContent>
    </Card>
  );
}
