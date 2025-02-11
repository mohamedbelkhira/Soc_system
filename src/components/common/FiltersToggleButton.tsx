import { Filter, FilterX } from "lucide-react";

import { Button } from "../ui/button";

export default function FiltersToggleButton({
  showFilters,
  onToggle,
}: {
  showFilters: boolean;
  onToggle: () => void;
}) {
  return (
    <Button
      size="icon"
      variant={showFilters ? "destructive" : "default"}
      onClick={onToggle}
    >
      {showFilters ? <FilterX /> : <Filter />}
    </Button>
  );
}
