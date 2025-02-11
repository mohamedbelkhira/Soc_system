import SearchInput from "@/components/common/SearchInput";
import SelectFilter from "@/components/common/SelectFilter";
import StatusSelect from "@/components/common/StatusSelect";
import TwoColumns from "@/components/common/layouts/TwoColumns";
import { Card, CardContent } from "@/components/ui/card";
import { useDebounce } from "@/hooks/use-debounce";
import { useCategories } from "@/swr/products/category.swr";

import { ProductFilteringParams } from "./useProductsFilters";

interface ProductFiltersProps {
  filters: ProductFilteringParams;
  setFilter: (
    key: keyof ProductFilteringParams,
    value: string | boolean | null
  ) => void;
}

export default function ProductsFilters({
  filters,
  setFilter,
}: ProductFiltersProps) {
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();

  const [searchTerm, setSearchTerm] = useDebounce(
    filters.searchTerm || "",
    400,
    (value) => {
      if (value !== filters.searchTerm) {
        setFilter("searchTerm", value || null);
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

  const handleCategoryChange = (value: string) => {
    setFilter("categoryId", value === "all" ? null : value);
  };

  const handleTypeChange = (value: string) => {
    if (value === "all") {
      setFilter("hasVariants", null);
    } else {
      setFilter("hasVariants", value === "true");
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6 space-y-6">
        <TwoColumns>
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            label="Rechercher par nom ou marque"
            placeholder="Chercher par nom ou par marque..."
          />

          <SelectFilter
            label="Filtrer par catégorie"
            value={filters.categoryId}
            onChange={handleCategoryChange}
            options={[
              { value: "all", label: "Toutes les catégories" },
              ...categories.map((category) => ({
                value: category.id,
                label: category.name,
              })),
            ]}
            disabled={isCategoriesLoading}
          />

          <SelectFilter
            label="Filtrer par type de produit"
            value={filters.hasVariants}
            onChange={handleTypeChange}
            options={[
              { value: "all", label: "Tous types" },
              { value: "true", label: "Avec des variantes" },
              { value: "false", label: "Sans variantes" },
            ]}
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
