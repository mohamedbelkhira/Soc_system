import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export interface CategoryFilteringParams {
  name?: string;
  isActive?: boolean;
}

// Define the params this hook is concerned with
const CATEGORY_PARAMS = ["name", "isActive"] as const;

export function useCategoriesFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => {
    const params: CategoryFilteringParams = {};
    const name = searchParams.get("name");
    if (name) params.name = name;
    const isActiveParam = searchParams.get("isActive");
    if (isActiveParam === "true") params.isActive = true;
    if (isActiveParam === "false") params.isActive = false;
    return params;
  }, [searchParams]);

  const setFilter = useCallback(
    (key: keyof CategoryFilteringParams, value: string | boolean | null) => {
      // Create new params but preserve ALL existing params
      const newParams = new URLSearchParams(searchParams);

      if (value === null) {
        newParams.delete(key);
      } else if (typeof value === "boolean") {
        newParams.set(key, value.toString());
      } else {
        newParams.set(key, value);
      }

      setSearchParams(newParams, { replace: false });
    },
    [searchParams, setSearchParams]
  );

  const clearFilters = useCallback(() => {
    // Create new params but only remove our specific params
    const newParams = new URLSearchParams(searchParams);
    CATEGORY_PARAMS.forEach((param) => newParams.delete(param));
    setSearchParams(newParams, { replace: false });
  }, [searchParams, setSearchParams]);

  const hasActiveFilters = useMemo(() => {
    return CATEGORY_PARAMS.some((param) => searchParams.has(param));
  }, [searchParams]);

  return {
    filters,
    setFilter,
    clearFilters,
    hasActiveFilters,
  };
}
