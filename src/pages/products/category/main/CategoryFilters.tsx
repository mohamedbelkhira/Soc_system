import SearchInput from "@/components/common/SearchInput";
import StatusSelect from "@/components/common/StatusSelect";
import { Card, CardContent } from "@/components/ui/card";
import { useDebounce } from "@/hooks/use-debounce";

import { CategoryFilteringParams } from "./useCategoriesFilters";

interface CategoryFiltersProps {
  filters: CategoryFilteringParams;
  setFilter: (
    key: keyof CategoryFilteringParams,
    value: string | boolean | null
  ) => void;
}

export default function CategoryFilters({
  filters,
  setFilter,
}: CategoryFiltersProps) {
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
            value={searchTerm}
            onChange={setSearchTerm}
            label="Chercher par nom"
            placeholder="Chercher par le nom de catégorie"
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
