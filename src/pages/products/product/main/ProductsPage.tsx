import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import AddButton from "@/components/common/AddButton";
import ButtonGroup from "@/components/common/ButtonGroup";
import CheckPermission from "@/components/common/CheckPermission";
import CustomPagination from "@/components/common/CustomPagination";
import FiltersToggleButton from "@/components/common/FiltersToggleButton";
import ResetFiltersButton from "@/components/common/ResetFiltersButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-provider";
import { usePagination } from "@/hooks/use-pagination";
import { useProducts } from "@/swr/products/product.swr";
import { Permission } from "@/types/permission.enum";
import handleError from "@/utils/handleError";

import ProductsFilters from "./ProductsFilters";
import ProductsTable from "./ProductsTable";
import { useProductsFilters } from "./useProductsFilters";

export default function ProductsPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const { currentPage, handlePageChange } = usePagination(10);

  const { filters, setFilter, clearFilters, hasActiveFilters } =
    useProductsFilters();

  const {
    data: products,
    totalPages,
    totalCount,
    isLoading,
    error,
  } = useProducts(searchParams);

  useEffect(() => {
    if (error) {
      handleError(error, "Échec lors du chargement des produits");
    }
  }, [error]);

  function handleFiltersToggle() {
    clearFilters();
    setShowFilters((oldValue) => !oldValue);
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Liste des produits ({totalCount})</CardTitle>
        <ButtonGroup>
          <FiltersToggleButton
            showFilters={showFilters}
            onToggle={handleFiltersToggle}
          />
          {hasActiveFilters && (
            <ResetFiltersButton clearFilters={clearFilters} />
          )}
          <CheckPermission
            requiredPermission={Permission.PRODUCT_CREATE}
            grantedPermissions={user?.permissions}
          >
            <AddButton href="/products/create" label="Ajouter un produit" />
          </CheckPermission>
        </ButtonGroup>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {showFilters && (
            <ProductsFilters filters={filters} setFilter={setFilter} />
          )}
          <ProductsTable products={products} isLoading={isLoading} />
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
