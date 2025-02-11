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
import { useClients } from "@/swr/client/client.swr";
import { useAdvanceSales } from "@/swr/sales/advance-sale.swr";
import { Permission } from "@/types/permission.enum";
import handleError from "@/utils/handleError";

import AdvanceSaleFilters from "./AdvanceSaleFilters";
import AdvanceSalesTable from "./AdvanceSalesTable";
import { useAdvanceSaleFilters } from "./useAdvanceSaleFilters";

export default function AdvanceSalesPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const { currentPage, handlePageChange } = usePagination(8);

  const { filters, setFilter, clearFilters, hasActiveFilters } =
    useAdvanceSaleFilters();

  const { data: clients } = useClients();
  const {
    data: advanceSales,
    totalPages,
    totalCount,
    isLoading,
    error,
  } = useAdvanceSales(searchParams);

  useEffect(() => {
    if (error) {
      handleError(error, "Erreur de chargement des ventes avec avance");
    }
  }, [error]);

  function handleFiltersToggle() {
    clearFilters();
    setShowFilters((oldValue) => !oldValue);
  }

  useEffect(() => {
    if (hasActiveFilters && !showFilters) {
      setShowFilters(true);
    }
  }, [hasActiveFilters, showFilters]);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Liste des ventes avec avance ({totalCount})</CardTitle>
        <ButtonGroup>
          <FiltersToggleButton
            showFilters={showFilters}
            onToggle={handleFiltersToggle}
          />
          {hasActiveFilters && (
            <ResetFiltersButton clearFilters={clearFilters} />
          )}
          <CheckPermission
            requiredPermission={Permission.SALE_CREATE}
            grantedPermissions={user?.permissions}
          >
            <AddButton href="/advance-sales/create" label="Ajouter une vente" />
          </CheckPermission>
        </ButtonGroup>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {showFilters && (
            <AdvanceSaleFilters
              clients={clients}
              filters={filters}
              setFilter={setFilter}
            />
          )}
          <AdvanceSalesTable
            advanceSales={advanceSales}
            isLoading={isLoading}
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
