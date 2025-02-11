// src/components/expenses/useExpenseFilters.ts
import { useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { ExpenseStatus } from "@/types/expense.dto";

export interface ExpenseFilteringParams {
  status?: ExpenseStatus;
  categoryId?: string;
  startDate?: Date;
  endDate?: Date;
}

export function useExpenseFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: ExpenseFilteringParams = useMemo(() => {
    const params: ExpenseFilteringParams = {};
    
    const status = searchParams.get("status");
    if (status) params.status = status as ExpenseStatus;
    
    const categoryId = searchParams.get("categoryId");
    if (categoryId) params.categoryId = categoryId;
    
    const startDate = searchParams.get("startDate");
    if (startDate) params.startDate = new Date(startDate);
    
    const endDate = searchParams.get("endDate");
    if (endDate) params.endDate = new Date(endDate);
    
    return params;
  }, [searchParams]);

  const setFilter = useCallback(
    (key: keyof ExpenseFilteringParams, value: string | Date | null | undefined) => {
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

  return { filters, setFilter, clearFilters, hasActiveFilters };
}