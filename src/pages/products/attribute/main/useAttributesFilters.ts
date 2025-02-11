import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export interface AttributeFilteringParams {
  name?: string;
  isActive?: boolean;
}

export function useAttributeFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => {
    const params: AttributeFilteringParams = {};

    const name = searchParams.get("name");
    if (name) params.name = name;

    const isActiveParam = searchParams.get("isActive");
    if (isActiveParam === "true") params.isActive = true;
    if (isActiveParam === "false") params.isActive = false;

    return params;
  }, [searchParams]);

  const setFilter = useCallback(
    (key: keyof AttributeFilteringParams, value: string | boolean | null) => {
      // Create a completely new URLSearchParams to avoid mutation
      const newParams = new URLSearchParams(searchParams);

      if (value === null) {
        newParams.delete(key);
      } else if (typeof value === "boolean") {
        newParams.set(key, value.toString());
      } else {
        newParams.set(key, value);
      }

      // Reset page to 1 when filters change
      newParams.set("page", "1");

      setSearchParams(newParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const clearFilters = useCallback(() => {
    // Create a new URLSearchParams with only pagination parameters
    const newParams = new URLSearchParams(
      Array.from(searchParams.entries()).filter(
        ([key]) => key === "page" || key === "pageSize"
      )
    );

    // Explicitly set page to 1
    newParams.set("page", "1");

    // Use replace to prevent adding to browser history
    setSearchParams(newParams, { replace: true });
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
