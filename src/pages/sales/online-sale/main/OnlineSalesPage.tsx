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
import { useDeliveryHandlers } from "@/swr/delivery-handler.swr";
import { useOnlineSales } from "@/swr/sales/online-sale.swr";
import { Permission } from "@/types/permission.enum";
import handleError from "@/utils/handleError";

import OnlineSaleFilters from "./OnlineSaleFilters";
import OnlineSalesTable from "./OnlineSalesTable";
import { useOnlineSaleFilters } from "./useOnlineSaleFilters";

export default function OnlineSalesPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const { currentPage, handlePageChange } = usePagination(8);

  const { filters, setFilter, clearFilters, hasActiveFilters } =
    useOnlineSaleFilters();

  const { data: clients } = useClients();
  const { deliveryHandlers } = useDeliveryHandlers();
  const {
    data: onlineSales,
    totalPages,
    isLoading,
    error,
  } = useOnlineSales(searchParams);

  useEffect(() => {
    if (error) {
      handleError(error, "Erreur de chargement des ventes en ligne");
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Liste des ventes en ligne ({onlineSales.length})</CardTitle>
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
            <AddButton href="/online-sales/create" label="Ajouter une vente" />
          </CheckPermission>
        </ButtonGroup>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {showFilters && (
            <OnlineSaleFilters
              clients={clients}
              deliveryHandlers={deliveryHandlers}
              filters={filters}
              setFilter={setFilter}
            />
          )}
          <OnlineSalesTable onlineSales={onlineSales} isLoading={isLoading} />
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
