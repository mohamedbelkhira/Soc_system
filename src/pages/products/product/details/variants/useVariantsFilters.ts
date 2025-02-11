import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export interface VariantFilteringParams {
  searchTerm?: string;
  isActive?: boolean;
}

export function useVariantsFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => {
    const params: VariantFilteringParams = {};

    const searchTerm = searchParams.get("searchTerm");
    if (searchTerm) params.searchTerm = searchTerm;

    const isActiveParam = searchParams.get("isActive");
    if (isActiveParam === "true") params.isActive = true;
    if (isActiveParam === "false") params.isActive = false;

    return params;
  }, [searchParams]);

  const setFilter = useCallback(
    (
      key: keyof VariantFilteringParams,
      value: string | boolean | undefined
    ) => {
      const newParams = new URLSearchParams(searchParams);

      if (value === null || value === undefined) {
        newParams.delete(key);
      } else if (typeof value === "boolean") {
        newParams.set(key, value.toString());
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
