import InformationCard from "@/components/common/InformationCard";
import TwoColumns from "@/components/common/layouts/TwoColumns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Client } from "@/types/clients/client.dto";
import { Mail, MapPinHouse, Phone, User } from "lucide-react";

export default function ClientSection({ client }: { client: Client }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Détails du client</CardTitle>
      </CardHeader>
      <CardContent>
        <TwoColumns>
          <InformationCard
            icon={User}
            label={"Nom et Prénom"}
            value={client.lastName + " " + client.firstName}
          />

          <InformationCard
            icon={Phone}
            label={"Numéro de téléphone"}
            value={client.phoneNumber}
          />
          {client.email && (
            <InformationCard
              icon={Mail}
              label={"E-mail"}
              value={client.email}
            />
          )}
          {client.address && (
            <InformationCard
              icon={MapPinHouse}
              label={"Adresse"}
              value={client.address}
            />
          )}
        </TwoColumns>
      </CardContent>
    </Card>
  );
}
