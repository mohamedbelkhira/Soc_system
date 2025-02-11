import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ButtonGroup from "@/components/common/ButtonGroup";
import CheckPermission from "@/components/common/CheckPermission";
import CustomPagination from "@/components/common/CustomPagination";
import FiltersToggleButton from "@/components/common/FiltersToggleButton";
import ResetFiltersButton from "@/components/common/ResetFiltersButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-provider";
import { usePagination } from "@/hooks/use-pagination";
import { usePaginatedCategories } from "@/swr/products/category.swr";
import { Permission } from "@/types/permission.enum";
import handleError from "@/utils/handleError";

import { CreateCategoryDialog } from "../create/CreateCategoryDialog";
import CategoriesTable from "./CategoriesTable";
import CategoryFilters from "./CategoryFilters";
import { useCategoriesFilters } from "./useCategoriesFilters";

export default function CategoriesPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const { currentPage, handlePageChange } = usePagination(6);
  const { filters, setFilter, clearFilters, hasActiveFilters } =
    useCategoriesFilters();

  const {
    data: categories,
    totalPages,
    totalCount,
    isLoading,
    error,
  } = usePaginatedCategories(searchParams);

  useEffect(() => {
    if (error) {
      handleError(error, "Échec lors du chargement des catégories");
    }
  }, [error]);

  useEffect(() => {
    if (hasActiveFilters) {
      setShowFilters(true);
    }
  }, [hasActiveFilters]);

  function handleFiltersToggle() {
    clearFilters();
    setShowFilters((oldValue) => !oldValue);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Liste des catégories de produits ({totalCount})</CardTitle>
        <ButtonGroup>
          {hasActiveFilters && (
            <ResetFiltersButton clearFilters={clearFilters} />
          )}
          <FiltersToggleButton
            showFilters={showFilters}
            onToggle={handleFiltersToggle}
          />
          <CheckPermission
            requiredPermission={Permission.PRODUCT_CREATE}
            grantedPermissions={user?.permissions}
          >
            <CreateCategoryDialog />
          </CheckPermission>
        </ButtonGroup>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {showFilters && (
            <CategoryFilters filters={filters} setFilter={setFilter} />
          )}
          <CategoriesTable isLoading={isLoading} categories={categories} />
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
