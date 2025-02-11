import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { StoreSaleStatus } from "@/schemas/sales/store-sale.schema";

export interface StoreSaleFilteringParams {
  reference?: string;
  clientId?: string;
  startDate?: Date;
  endDate?: Date;
  status?: StoreSaleStatus;
}

export function useStoreSaleFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => {
    const params: StoreSaleFilteringParams = {};

    const reference = searchParams.get("reference");
    if (reference) params.reference = reference;

    const clientId = searchParams.get("clientId");
    if (clientId) params.clientId = clientId;

    const startDate = searchParams.get("startDate");
    if (startDate) params.startDate = new Date(startDate);

    const endDate = searchParams.get("endDate");
    if (endDate) params.endDate = new Date(endDate);

    const status = searchParams.get("status") as StoreSaleStatus;
    if (status) params.status = status;

    return params;
  }, [searchParams]);

  const setFilter = useCallback(
    (
      key: keyof StoreSaleFilteringParams,
      value: string | Date | StoreSaleStatus | null | undefined
    ) => {
      const newParams = new URLSearchParams(searchParams);

      if (value === null || value === undefined) {
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
        state: { preventHistoryEntry: true },
      });
    },
    [searchParams, setSearchParams]
  );

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

  return {
    filters,
    setFilter,
    clearFilters,
    hasActiveFilters,
  };
}
