import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export interface ProductFilteringParams {
  searchTerm?: string;
  categoryId?: string;
  hasVariants?: boolean;
  isActive?: boolean;
}

export function useProductsFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => {
    const params: ProductFilteringParams = {};

    const searchTerm = searchParams.get("searchTerm");
    if (searchTerm) params.searchTerm = searchTerm;

    const categoryId = searchParams.get("categoryId");
    if (categoryId) params.categoryId = categoryId;

    // Modify hasVariants parsing to be more explicit
    const hasVariantsParam = searchParams.get("hasVariants");
    console.log("Raw hasVariants param:", hasVariantsParam); // Debug log

    // Use a more explicit conversion
    if (hasVariantsParam === "true") {
      params.hasVariants = true;
    } else if (hasVariantsParam === "false") {
      params.hasVariants = false;
    }

    const isActiveParam = searchParams.get("isActive");
    if (isActiveParam === "true") params.isActive = true;
    if (isActiveParam === "false") params.isActive = false;

    return params;
  }, [searchParams]);

  const setFilter = useCallback(
    (key: keyof ProductFilteringParams, value: string | boolean | null) => {
      const newParams = new URLSearchParams(searchParams);

      if (value === null) {
        newParams.delete(key);
      } else if (typeof value === "boolean") {
        // Explicitly convert boolean to string
        newParams.set(key, value.toString());
        console.log(`Setting ${key} to ${value.toString()}`); // Debug log
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
