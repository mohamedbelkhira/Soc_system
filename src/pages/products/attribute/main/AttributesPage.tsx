import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import CheckPermission from "@/components/common/CheckPermission";
import CustomPagination from "@/components/common/CustomPagination";
import FiltersToggleButton from "@/components/common/FiltersToggleButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-provider";
import { usePagination } from "@/hooks/use-pagination";
import { useAttributes } from "@/swr/products/attribute.swr";
import { Permission } from "@/types/permission.enum";
import handleError from "@/utils/handleError";

import { CreateAttributeDialog } from "../create/CreateAttributeDialog";
import AttributeFilters from "./AttributesFilters";
import AttributesTable from "./AttributesTable";
import { useAttributeFilters } from "./useAttributesFilters";

export function AttributesPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const { currentPage, handlePageChange } = usePagination(10);
  const { filters, setFilter, clearFilters, hasActiveFilters } =
    useAttributeFilters();

  const {
    data: attributes,
    totalPages,
    totalCount,
    isLoading,
    error,
  } = useAttributes(searchParams);

  useEffect(() => {
    if (error) {
      handleError(error, "Échec lors du chargement des attributs");
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
        <CardTitle>Liste des attributs ({totalCount})</CardTitle>
        <div className="flex gap-2">
          <FiltersToggleButton
            showFilters={showFilters}
            onToggle={handleFiltersToggle}
          />
          <CheckPermission
            requiredPermission={Permission.PRODUCT_CREATE}
            grantedPermissions={user?.permissions}
          >
            <CreateAttributeDialog />
          </CheckPermission>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {showFilters && (
            <AttributeFilters filters={filters} setFilter={setFilter} />
          )}
          <AttributesTable
            isLoading={isLoading && !attributes}
            attributes={attributes}
          />
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

export default AttributesPage;
