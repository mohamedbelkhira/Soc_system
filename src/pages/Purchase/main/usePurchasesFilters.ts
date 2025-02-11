import { useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export interface PurchaseFilteringParams {
  status?: string;
  supplierId?: string;
  startDate?: Date;
  endDate?: Date;
}

export function usePurchasesFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: PurchaseFilteringParams = useMemo(() => {
    const params: PurchaseFilteringParams = {};
    const status = searchParams.get("status");
    if (status) params.status = status;

    const supplierId = searchParams.get("supplierId");
    if (supplierId) params.supplierId = supplierId;

    const startDate = searchParams.get("startDate");
    if (startDate) params.startDate = new Date(startDate);

    const endDate = searchParams.get("endDate");
    if (endDate) params.endDate = new Date (endDate);

    return params;
  }, [searchParams]);

  const setFilter = useCallback(
    (
    key: keyof PurchaseFilteringParams, value: string | Date | null | undefined) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === null || value === undefined)  {
      newParams.delete(key);
    } else if (value instanceof Date) {
        newParams.set(key, value.toISOString());
    } else {
      newParams.set(key, value);
    }
    newParams.set("page", "1");
    setSearchParams(newParams, { 
        replace: true,
        preventScrollReset: true,
        state : {preventHistoryEntry: true},
     });
  }, [searchParams, setSearchParams]);

  const clearFilters = useCallback(() => {
    const newParams = new URLSearchParams(
      Array.from(searchParams.entries()).filter(
        ([key]) => key === "page" || key === "pageSize"
      )
    );
    newParams.set("page", "1");

    setSearchParams(newParams, { 
        replace: true,
        preventScrollReset: true,
        state: { preventHistoryEntry: true },
     });
  }, [searchParams, setSearchParams]);

  const hasActiveFilters = useMemo(() => {
    return Object.keys(filters).length > 0;
  }, [filters]);

  return { filters, setFilter, clearFilters, hasActiveFilters };
}