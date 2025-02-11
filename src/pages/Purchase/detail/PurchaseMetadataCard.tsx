import React from "react";

import InformationCard from "@/components/common/InformationCard";
import TwoColumns from "@/components/common/layouts/TwoColumns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Purchase_with_extra_data } from "@/types/getpurchase.dto";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { formatDate } from "@/utils/formatters/formatDate";
import {
  Activity,
  Calendar,
  Info,
  Tag as TagIcon,
  Truck,
} from "lucide-react";

interface PurchaseMetadataCardProps {
  purchase: Purchase_with_extra_data;
}

const PurchaseMetadataCard: React.FC<PurchaseMetadataCardProps> = ({
  purchase,
}) => {
  

  const getStatusLabel = (state: string) => {
    switch (state) {
      case "RECEIVED":
        return "Réceptionné";
      case "CANCELED":
        return "Annulé";
      case "ORDERED":
        return "Commandé";
      default:
        return "Statut Inconnu";
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Métadonnées de l'Achat</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <TwoColumns>
          <InformationCard
            icon={Truck}
            label={"Fournisseur"}
            value={purchase.supplier.name}
          />
          <InformationCard
            icon={Activity}
            label={"Statut"}
            value={getStatusLabel(purchase.state)}
          />
            {purchase.state === "ORDERED" || purchase.state === "RECEIVED" ? (
              <>
                <InformationCard
                  icon={Calendar}
                  label="Date de Commande"
                  value={purchase.orderedAt ? formatDate(purchase.orderedAt) : "Non spécifié"}
                />
                <InformationCard
                  icon={Calendar}
                  label="Date de Réception"
                  value={purchase.receivedAt ? formatDate(purchase.receivedAt) : "Non spécifié"}
                />
              </>
            ) : purchase.state === "CANCELED" ? (
              <>
                <InformationCard
                  icon={Calendar}
                  label="Date de Commande"
                  value={purchase.orderedAt ? formatDate(purchase.orderedAt) : "Non spécifié"}
                />
                <InformationCard
                  icon={Calendar}
                  label="Date d'annulation"
                  value={purchase.canceledAt ? formatDate(purchase.canceledAt) : "Non spécifié"}
                />
              </>
            ) : null}

        
        </TwoColumns>
        <InformationCard
            icon={TagIcon}
            label={"Montant Total"}
            value={formatCurrency(purchase.totalAmount)}
          />
        {purchase.description && (
          <InformationCard
            icon={Info}
            label={"Description"}
            value={purchase.description}
          />
        )}
        {/* {purchase.description && (
          <div className="border-t pt-4">
            <div className="flex items-center space-x-2 mb-2">
              <TagIcon size={16} />
              <span className="text-sm font-medium ">Description:</span>
            </div>
            <p className="text-sm  italic">{purchase.description}</p>
          </div>
        )} */}
      </CardContent>
    </Card>
  );
};

export default PurchaseMetadataCard;
