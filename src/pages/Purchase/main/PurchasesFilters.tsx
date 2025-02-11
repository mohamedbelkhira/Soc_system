// src/components/purchases/PurchasesFilters.tsx
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import TwoColumns from "@/components/common/layouts/TwoColumns";
import SelectFilter from "@/components/common/SelectFilter";
import { PurchaseFilteringParams } from "./usePurchasesFilters";
import { suppliersApi } from "@/api/suppliers.api";
import CustomDatePicker from "@/components/CustomDatePicker";

interface PurchasesFiltersProps {
  filters: PurchaseFilteringParams;
  setFilter: (key: keyof PurchaseFilteringParams,
    value: string |  Date | null | undefined
   ) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

const STATUS_OPTIONS = [
  { value: "all", label: "Tous les statuts" },
  { value: "ORDERED", label: "Commandé" },
  { value: "RECEIVED", label: "Reçu" },
  { value: "CANCELED", label: "Annulé" },
];

export default function PurchasesFilters({
  filters,
  setFilter,
  clearFilters,
  hasActiveFilters,
}: PurchasesFiltersProps) {
  const [suppliers, setSuppliers] = useState<{ id: string; name: string }[]>([]);
  const [isSuppliersLoading, setIsSuppliersLoading] = useState(true);
  const [suppliersError, setSuppliersError] = useState<string | null>(null);

  
  useEffect(() => {
    async function fetchSuppliers() {
      setIsSuppliersLoading(true);
      try {
        const response = await suppliersApi.getAll();
        if (response.status === "success") {
          setSuppliers(response.data);
        } else {
          setSuppliersError(response.message || "Erreur lors du chargement des fournisseurs");
        }
      } catch (error: unknown) {
        // Type guard to check if error is an Error object
        if (error instanceof Error) {
          setSuppliersError(error.message);
        } else {
          setSuppliersError("Erreur lors du chargement des fournisseurs");
        }
      } finally {
        setIsSuppliersLoading(false);
      }
    }
  
    fetchSuppliers();
  }, []);

  const handleStatusChange = (value: string) => {
    setFilter("status", value === "all" ? null : value);
  };

  const handleSupplierChange = (value: string) => {
    setFilter("supplierId", value === "all" ? null : value);
  };

//   const [startDate, setStartDate] = useState(filters.startDate || "");
//   const [endDate, setEndDate] = useState(filters.endDate || "");

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
          {/* Status Filter */}
          <SelectFilter
            label="Filtrer par statut"
            value={filters.status || "all"}
            onChange={handleStatusChange}
            options={STATUS_OPTIONS}
          />

          {/* Supplier Filter */}
          <SelectFilter
            label="Filtrer par fournisseur"
            value={filters.supplierId || "all"}
            onChange={handleSupplierChange}
            options={[
              { value: "all", label: "Tous les fournisseurs" },
              ...suppliers.map((supplier) => ({
                value: supplier.id,
                label: supplier.name,
              })),
            ]}
            disabled={isSuppliersLoading || suppliersError !== null}
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
          {/* Start Date Filter
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-foreground">
              Date de début
            </label>
            <input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              className="border rounded p-2 text-sm"
            />
          </div> */}

          {/* End Date Filter */}
          {/* <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-foreground">
              Date de fin
            </label>
            <input
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              className="border rounded p-2 text-sm"
            />
          </div> */}
        </TwoColumns>

        {/* Reset Filters Button */}
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

        {/* Suppliers Error Message */}
        {suppliersError && (
          <p className="text-red-500 text-sm">
            {suppliersError}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
