import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export interface ClientFilteringParams {
  searchTerm?: string;
}

export function useClientsFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => {
    const params: ClientFilteringParams = {};

    const searchTerm = searchParams.get("searchTerm");
    if (searchTerm) params.searchTerm = searchTerm;

    return params;
  }, [searchParams]);

  const setFilter = useCallback(
    (key: keyof ClientFilteringParams, value: string | undefined) => {
      const newParams = new URLSearchParams(searchParams);

      if (value === null || value === undefined) {
        newParams.delete(key);
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
