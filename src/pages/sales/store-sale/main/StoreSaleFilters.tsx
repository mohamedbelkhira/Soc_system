import CustomDatePicker from "@/components/CustomDatePicker";
import SearchInput from "@/components/common/SearchInput";
import SelectFilter from "@/components/common/SelectFilter";
import TwoColumns from "@/components/common/layouts/TwoColumns";
import { Card, CardContent } from "@/components/ui/card";
import { useDebounce } from "@/hooks/use-debounce";
import { StoreSaleStatus } from "@/schemas/sales/store-sale.schema";
import { Client } from "@/types/clients/client.dto";
import getClientLabel from "@/utils/getClientLabel";
import getStoreSaleStatusLabel from "@/utils/status-transformers/store-sale/getStoreSaleStatusLabel";

import { StoreSaleFilteringParams } from "./useStoreSaleFilters";

interface StoreSaleFiltersProps {
  clients: Client[];
  filters: StoreSaleFilteringParams;
  setFilter: (
    key: keyof StoreSaleFilteringParams,
    value: string | Date | StoreSaleStatus | null | undefined
  ) => void;
}

export default function StoreSaleFilters({
  clients,
  filters,
  setFilter,
}: StoreSaleFiltersProps) {
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

  const handleStatusChange = (value: string) => {
    if (value === "all") {
      setFilter("status", null);
    } else {
      setFilter("status", value as StoreSaleStatus);
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

          <SelectFilter
            label="Filtrer par statut"
            value={filters.status || "all"}
            onChange={handleStatusChange}
            options={[
              { value: "all", label: "Tous les statuts" },
              ...Object.entries(StoreSaleStatus).map((status) => {
                return {
                  value: status[0],
                  label: getStoreSaleStatusLabel(status[1]),
                };
              }),
            ]}
          />
        </TwoColumns>
      </CardContent>
    </Card>
  );
}
