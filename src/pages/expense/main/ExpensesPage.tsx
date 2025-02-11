import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ExpensesTable from "./ExpensesTable";
import CustomPagination from "@/components/common/CustomPagination";
import { useSearchParams } from "react-router-dom";
import { useExpenses } from "@/swr/expense.swr";
import handleError from "@/utils/handleError";
import ButtonGroup from "@/components/common/ButtonGroup";
import FiltersToggleButton from "@/components/common/FiltersToggleButton";
import ResetFiltersButton from "@/components/common/ResetFiltersButton";
import ExpenseFilters from "./ExpenseFilters";
import { useExpenseFilters } from "./useExpenseFilters";
import { usePagination } from "@/hooks/use-pagination";
import CreateExpenseDialog from "../create/CreateExpenseDialog";

import { useAuth } from "@/contexts/auth-provider";
import CheckPermission from "@/components/common/CheckPermission";
import { Permission } from "@/types/permission.enum";

export default function ExpensesPage() {
  const {user} = useAuth();
  const [searchParams] = useSearchParams();
  const { filters, setFilter, clearFilters, hasActiveFilters } = useExpenseFilters();
  const [showFilters, setShowFilters] = useState(false);
  const { currentPage, handlePageChange } = usePagination(10);

  // Construct URLSearchParams for useExpenses
  const expenseParams = new URLSearchParams(searchParams.toString());
  const {
    data: expenses,
    totalPages,
    totalCount,
    isLoading,
    error,
  } = useExpenses(expenseParams);

  useEffect(() => {
    if (error) {
      handleError(error, "Échec lors du chargement des dépenses");
    }
  }, [error]);

  const handleFiltersToggle = () => {
    clearFilters();
    setShowFilters((prev) => !prev);
  };

  const handleRefresh = () => {
   console.log("refresh");
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Liste des dépenses ({totalCount})</CardTitle>
        <ButtonGroup>
          <FiltersToggleButton
            showFilters={showFilters}
            onToggle={handleFiltersToggle}
          />
          {hasActiveFilters && (
            <ResetFiltersButton clearFilters={clearFilters} />
          )}
           <CheckPermission
                    requiredPermission={Permission.EXPENSE_CREATE}
                    grantedPermissions={user?.permissions}
                    >
            <CreateExpenseDialog />
          </CheckPermission>
        </ButtonGroup>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {showFilters && (
            <ExpenseFilters
              filters={filters}
              setFilter={setFilter}
              clearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          )}
          <ExpensesTable
            expenses={expenses || []}
            isLoading={isLoading}
            onRefresh={handleRefresh}
          />
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
