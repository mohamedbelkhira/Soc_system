// src/components/expenses/ExpenseFilters.tsx
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import TwoColumns from "@/components/common/layouts/TwoColumns";
import SelectFilter from "@/components/common/SelectFilter";
import { ExpenseFilteringParams } from "./useExpenseFilters";
import { expenseCategoriesApi } from "@/api/expenseCategories.api";
import CustomDatePicker from "@/components/CustomDatePicker";

interface ExpenseFiltersProps {
  filters: ExpenseFilteringParams;
  setFilter: (
    key: keyof ExpenseFilteringParams,
    value: string | Date | null | undefined
  ) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

const STATUS_OPTIONS = [
  { value: "all", label: "Tous les statuts" },
  { value: "PENDING", label: "En attente" },
  { value: "PAID", label: "Payé" },
  { value: "CANCELED", label: "Annulé" },
];

export default function ExpenseFilters({
  filters,
  setFilter,
  clearFilters,
  hasActiveFilters,
}: ExpenseFiltersProps) {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      setIsCategoriesLoading(true);
      try {
        const response = await expenseCategoriesApi.getAll();
        if (response.status === "success") {
          setCategories(response.data);
        } else {
          setCategoriesError(response.message || "Erreur lors du chargement des catégories");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setCategoriesError(error.message);
        } else {
          setCategoriesError("Erreur lors du chargement des catégories");
        }
      } finally {
        setIsCategoriesLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const handleStatusChange = (value: string) => {
    setFilter("status", value === "all" ? null : value);
  };

  const handleCategoryChange = (value: string) => {
    setFilter("categoryId", value === "all" ? null : value);
  };

  const handleStartDateChange = (date: Date | undefined) => {
    if (date && filters.endDate && date > filters.endDate) {
      setFilter("startDate", filters.endDate);
      setFilter("endDate", date);
    } else {
      setFilter("startDate", date);
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (date && filters.startDate && date < filters.startDate) {
      setFilter("endDate", filters.startDate);
      setFilter("startDate", date);
    } else {
      setFilter("endDate", date);
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6 space-y-6">
        <TwoColumns>
          <SelectFilter
            label="Filtrer par statut"
            value={filters.status || "all"}
            onChange={handleStatusChange}
            options={STATUS_OPTIONS}
          />

          <SelectFilter
            label="Filtrer par catégorie"
            value={filters.categoryId || "all"}
            onChange={handleCategoryChange}
            options={[
              { value: "all", label: "Toutes les catégories" },
              ...categories.map((category) => ({
                value: category.id,
                label: category.name,
              })),
            ]}
            disabled={isCategoriesLoading || categoriesError !== null}
          />

          <CustomDatePicker
            label="Date de début"
            date={filters.startDate}
            onChange={handleStartDateChange}
          />

          <CustomDatePicker
            label="Date de fin"
            date={filters.endDate}
            onChange={handleEndDateChange}
          />
        </TwoColumns>

        {hasActiveFilters && (
          <div className="flex justify-end">
            <Button
              variant="destructive"
              onClick={clearFilters}
              className="whitespace-nowrap"
            >
              Réinitialiser les filtres
            </Button>
          </div>
        )}

        {categoriesError && (
          <p className="text-red-500 text-sm">
            {categoriesError}
          </p>
        )}
      </CardContent>
    </Card>
  );
}