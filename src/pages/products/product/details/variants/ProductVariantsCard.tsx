import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import ButtonGroup from "@/components/common/ButtonGroup";
import CustomPagination from "@/components/common/CustomPagination";
import FiltersToggleButton from "@/components/common/FiltersToggleButton";
import ResetFiltersButton from "@/components/common/ResetFiltersButton";
import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePagination } from "@/hooks/use-pagination";
import { useProductVariants } from "@/swr/products/variant.swr";
import { Category } from "@/types/category.dto";
import { Product } from "@/types/product.dto";
import handleError from "@/utils/handleError";
import { showToast } from "@/utils/showToast";

import CreateVariantDialog from "./CreateVariantsDialog";
import ProductVariantsTable from "./ProductVariantsTable";
import VariantsFilters from "./VariantsFilters";
import { useVariantsFilters } from "./useVariantsFilters";

export default function ProductVariantsCard({
  product,
  category,
}: {
  product: Product;
  category: Category;
}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const { filters, setFilter, clearFilters, hasActiveFilters } =
    useVariantsFilters();
  const { currentPage, handlePageChange } = usePagination();
  const {
    data: variants,
    totalPages,
    totalCount,
    isLoading,
    error,
  } = useProductVariants(product.id, searchParams);

  useEffect(() => {
    if (hasActiveFilters && !showFilters) {
      setShowFilters(true);
    }
  }, [hasActiveFilters, showFilters]);

  if (isLoading) return <TableSkeleton />;

  if (error) {
    handleError(error, "Échec lors du chargement des variantes", () => {
      navigate("/products");
    });
  }
  if (!variants) {
    showToast("error", "Échec lors du chargement des variantes");
    navigate("/products");
    return;
  }

  function handleFiltersToggle() {
    clearFilters();
    setShowFilters((oldValue) => !oldValue);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>Variantes du produit ({totalCount})</CardTitle>
          <ButtonGroup>
            <FiltersToggleButton
              showFilters={showFilters}
              onToggle={handleFiltersToggle}
            />
            {hasActiveFilters && (
              <ResetFiltersButton clearFilters={clearFilters} />
            )}
            <CreateVariantDialog product={product} />
          </ButtonGroup>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {showFilters && (
          <VariantsFilters filters={filters} setFilter={setFilter} />
        )}
        <ProductVariantsTable variants={variants} category={category} />
        <div className="flex justify-center">
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}
