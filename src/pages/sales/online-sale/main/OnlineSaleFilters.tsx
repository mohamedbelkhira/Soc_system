import CustomDatePicker from "@/components/CustomDatePicker";
import SearchInput from "@/components/common/SearchInput";
import SelectFilter from "@/components/common/SelectFilter";
import TwoColumns from "@/components/common/layouts/TwoColumns";
import { Card, CardContent } from "@/components/ui/card";
import { useDebounce } from "@/hooks/use-debounce";
import { OnlineSaleStatus } from "@/schemas/sales/online-sale.schema";
import { Client } from "@/types/clients/client.dto";
import { DeliveryHandler } from "@/types/deliveryHandler.dto";
import getClientLabel from "@/utils/getClientLabel";
import getDeliveryHandlerLabel from "@/utils/getDeliveryHandlerLabel";
import getOnlineSaleStatusLabel from "@/utils/status-transformers/online-sale/getOnlineSaleStatusLabel";

import { OnlineSaleFilteringParams } from "./useOnlineSaleFilters";

interface OnlineSaleFiltersProps {
  clients: Client[];
  deliveryHandlers: DeliveryHandler[];
  filters: OnlineSaleFilteringParams;
  setFilter: (
    key: keyof OnlineSaleFilteringParams,
    value: string | Date | OnlineSaleStatus | null | undefined
  ) => void;
}

export default function OnlineSaleFilters({
  clients,
  deliveryHandlers,
  filters,
  setFilter,
}: OnlineSaleFiltersProps) {
  const [reference, setReference] = useDebounce(
    filters.reference || "",
    400,
    (value) => {
      if (value !== filters.reference) {
        setFilter("reference", value || null);
      }
    }
  );

  const handleClientChange = (value: string) => {
    if (value === "all") {
      setFilter("clientId", null);
    } else {
      setFilter("clientId", value);
    }
  };

  const handleDeliveryHandlerChange = (value: string) => {
    if (value === "all") {
      setFilter("deliveryHandlerId", null);
    } else {
      setFilter("deliveryHandlerId", value);
    }
  };

  const handleStatusChange = (value: string) => {
    if (value === "all") {
      setFilter("status", null);
    } else {
      setFilter("status", value as OnlineSaleStatus);
    }
  };

  const handleStartDateChange = (date: Date | undefined) => {
    if (date && filters.endDate && date > filters.endDate) {
      setFilter("startDate", filters.endDate);
      setFilter("endDate", date);
    } else {
      setFilter("startDate", date);
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (date && filters.startDate && date < filters.startDate) {
      setFilter("endDate", filters.startDate);
      setFilter("startDate", date);
    } else {
      setFilter("endDate", date);
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6 space-y-6">
        <TwoColumns>
          <SearchInput
            value={reference}
            onChange={setReference}
            placeholder="Rechercher par référence..."
          />
          <SelectFilter
            label="Filtrer par statut"
            value={filters.status || "all"}
            onChange={handleStatusChange}
            options={[
              { value: "all", label: "Tous les statuts" },
              ...Object.entries(OnlineSaleStatus).map((status) => {
                return {
                  value: status[0],
                  label: getOnlineSaleStatusLabel(status[1]),
                };
              }),
            ]}
          />

          <SelectFilter
            label="Filtrer par client"
            value={filters.clientId || "all"}
            onChange={handleClientChange}
            options={[
              { value: "all", label: "Tous les clients" },
              ...clients.map((client) => {
                return {
                  value: client.id,
                  label: getClientLabel(client),
                };
              }),
            ]}
          />
          <SelectFilter
            label="Filtrer par livreur"
            value={filters.deliveryHandlerId || "all"}
            onChange={handleDeliveryHandlerChange}
            options={[
              { value: "all", label: "Tous les livreurs" },
              ...deliveryHandlers.map((deliveryHandler) => {
                return {
                  value: deliveryHandler.id,
                  label: getDeliveryHandlerLabel(deliveryHandler),
                };
              }),
            ]}
          />

          <CustomDatePicker
            label="Date de début"
            date={filters.startDate}
            onChange={handleStartDateChange}
          />
          <CustomDatePicker
            label="Date de fin"
            date={filters.endDate}
            onChange={handleEndDateChange}
          />
        </TwoColumns>
      </CardContent>
    </Card>
  );
}
