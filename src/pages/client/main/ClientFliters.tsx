import SearchInput from "@/components/common/SearchInput";
import { Card, CardContent } from "@/components/ui/card";
import { useDebounce } from "@/hooks/use-debounce";

import { ClientFilteringParams } from "./useClientsFilters";

interface ClientFiltersProps {
  filters: ClientFilteringParams;
  setFilter: (
    key: keyof ClientFilteringParams,
    value: string | undefined
  ) => void;
}

export default function ClientFilters({
  filters,
  setFilter,
}: ClientFiltersProps) {
  const [searchTerm, setSearchTerm] = useDebounce(
    filters.searchTerm || "",
    400,
    (value) => {
      if (value !== filters.searchTerm) {
        setFilter("searchTerm", value || undefined);
      }
    }
  );

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="w-[580px] flex flex-col gap-4 md:flex-row md:items-end">
          <SearchInput value={searchTerm} onChange={setSearchTerm} />
        </div>
      </CardContent>
    </Card>
  );
}
