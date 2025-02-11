import SearchInput from "@/components/common/SearchInput";
import StatusSelect from "@/components/common/StatusSelect";
import TwoColumns from "@/components/common/layouts/TwoColumns";
import { Card, CardContent } from "@/components/ui/card";
import { useDebounce } from "@/hooks/use-debounce";

import { VariantFilteringParams } from "./useVariantsFilters";

interface VariantFiltersProps {
  filters: VariantFilteringParams;
  setFilter: (
    key: keyof VariantFilteringParams,
    value: string | boolean | undefined
  ) => void;
}

export default function VariantsFilters({
  filters,
  setFilter,
}: VariantFiltersProps) {
  const [searchTerm, setSearchTerm] = useDebounce(
    filters.searchTerm || "",
    1000,
    (value) => {
      if (value !== filters.searchTerm) {
        setFilter("searchTerm", value || undefined);
      }
    }
  );

  const handleStatusChange = (value: string) => {
    if (value === "all") {
      setFilter("isActive", undefined);
    } else {
      setFilter("isActive", value === "true");
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6 space-y-6">
        <TwoColumns>
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            label="Chercher par valeurs d'attributs"
            placeholder="Chercher par valeurs d'attributs"
          />

          <StatusSelect
            value={filters.isActive?.toString() || "all"}
            onChange={handleStatusChange}
          />
        </TwoColumns>
      </CardContent>
    </Card>
  );
}
