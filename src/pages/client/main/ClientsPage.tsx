import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import AddButton from "@/components/common/AddButton";
import CustomPagination from "@/components/common/CustomPagination";
import FiltersToggleButton from "@/components/common/FiltersToggleButton";
import Page from "@/components/common/Page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePagination } from "@/hooks/use-pagination";
import { useClients } from "@/swr/client/client.swr";
import handleError from "@/utils/handleError";

import { CreateClientDialog } from "../create/CreateClientDialog";
import ClientFilters from "./ClientFliters";
import ClientsTable from "./ClientsTable";
import { useClientsFilters } from "./useClientsFilters";

export function ClientsPage() {
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const { currentPage, handlePageChange } = usePagination(10);
  const { filters, setFilter, clearFilters, hasActiveFilters } =
    useClientsFilters();

  const {
    data: clients,
    totalPages,
    totalCount,
    isLoading,
    error,
  } = useClients(searchParams);

  useEffect(() => {
    if (error) {
      handleError(error, "Échec lors du chargement des clients");
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
    <Page>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Liste des clients ({totalCount})</CardTitle>
          <div className="flex gap-2">
            <FiltersToggleButton
              showFilters={showFilters}
              onToggle={handleFiltersToggle}
            />

            <CreateClientDialog
              trigger={<AddButton label="Ajouter un client" />}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {showFilters && (
              <ClientFilters filters={filters} setFilter={setFilter} />
            )}
            <ClientsTable isLoading={isLoading && !clients} clients={clients} />

            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </CardContent>
      </Card>
    </Page>
  );
}

export default ClientsPage;
