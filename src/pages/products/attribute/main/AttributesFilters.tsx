import SearchInput from "@/components/common/SearchInput";
import StatusSelect from "@/components/common/StatusSelect";
import { Card, CardContent } from "@/components/ui/card";
import { useDebounce } from "@/hooks/use-debounce";

import { AttributeFilteringParams } from "./useAttributesFilters";

interface AttributeFiltersProps {
  filters: AttributeFilteringParams;
  setFilter: (
    key: keyof AttributeFilteringParams,
    value: string | boolean | null
  ) => void;
}

export default function AttributeFilters({
  filters,
  setFilter,
}: AttributeFiltersProps) {
  const [searchTerm, setSearchTerm] = useDebounce(
    filters.name || "",
    400,
    (value) => {
      if (value !== filters.name) {
        setFilter("name", value || null);
      }
    }
  );

  const handleStatusChange = (value: string) => {
    if (value === "all") {
      setFilter("isActive", null);
    } else {
      setFilter("isActive", value === "true");
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <SearchInput
            label="Rechercher par nom"
            value={searchTerm}
            onChange={setSearchTerm}
          />
          <StatusSelect
            value={filters.isActive?.toString() || "all"}
            onChange={handleStatusChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}
