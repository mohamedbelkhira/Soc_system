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
import { usePurchases } from "@/swr/purchase.swr";
import { Permission } from "@/types/permission.enum";
import handleError from "@/utils/handleError";

import PurchasesFilters from "./PurchasesFilters";
import PurchasesTable from "./PurchasesTable";
import { usePurchasesFilters } from "./usePurchasesFilters";

export default function PurchasesPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const { filters, setFilter, clearFilters, hasActiveFilters } =
    usePurchasesFilters();
  const [showFilters, setShowFilters] = useState(false);
  const { currentPage, handlePageChange } = usePagination(10);

  // Construct URLSearchParams for usePurchases
  const purchasesParams = new URLSearchParams(searchParams.toString());

  const {
    data: purchases,
    totalPages,
    totalCount,
    isLoading,
    error,
  } = usePurchases(purchasesParams);

  useEffect(() => {
    if (error) {
      handleError(error, "Échec lors du chargement des achats");
    }
  }, [error]);

  const handleFiltersToggle = () => {
    clearFilters();
    setShowFilters((prev) => !prev);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Liste des achats ({totalCount})</CardTitle>
        <ButtonGroup>
          <FiltersToggleButton
            showFilters={showFilters}
            onToggle={handleFiltersToggle}
          />
          {hasActiveFilters && (
            <ResetFiltersButton clearFilters={clearFilters} />
          )}
          <CheckPermission
            requiredPermission={Permission.PURCHASE_CREATE}
            grantedPermissions={user?.permissions}
          >
            <AddButton label="Ajouter un Achat" href="/create-purchases" />
          </CheckPermission>
        </ButtonGroup>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {showFilters && (
            <PurchasesFilters
              filters={filters}
              setFilter={setFilter}
              clearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          )}
          <PurchasesTable purchases={purchases} isLoading={isLoading} />
          <div className="flex justify-center">
            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
