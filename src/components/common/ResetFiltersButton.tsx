import { Button } from "../ui/button";

export default function ResetFiltersButton({
  clearFilters,
}: {
  clearFilters: () => void;
}) {
  return null;
  return (
    <Button
      variant="destructive"
      onClick={clearFilters}
      className="whitespace-nowrap"
    >
      Réinitialiser les filtres
    </Button>
  );
}
