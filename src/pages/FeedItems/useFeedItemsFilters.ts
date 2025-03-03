import { useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export interface FeedItemFilteringParams {
  feedId?: string;
  readStatus?: boolean;
  startDate?: Date;
  endDate?: Date;
  tagIds?: string[];
  searchTerm?: string;
}

export function useFeedItemsFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: FeedItemFilteringParams = useMemo(() => {
    const params: FeedItemFilteringParams = {};
    
    const feedId = searchParams.get("feedId");
    if (feedId) params.feedId = feedId;
    
    const readStatus = searchParams.get("readStatus");
    if (readStatus !== null) {
      params.readStatus = readStatus === 'true';
    }
    
    const startDate = searchParams.get("startDate");
    if (startDate) params.startDate = new Date(startDate);
    
    const endDate = searchParams.get("endDate");
    if (endDate) params.endDate = new Date(endDate);
    
    const tagIds = searchParams.getAll("tagIds");
    if (tagIds && tagIds.length > 0) params.tagIds = tagIds;
    
    const searchTerm = searchParams.get("searchTerm");
    if (searchTerm) params.searchTerm = searchTerm;
    
    return params;
  }, [searchParams]);

  const setFilter = useCallback(
    (
      key: keyof FeedItemFilteringParams, 
      value: string | boolean | Date | string[] | null | undefined
    ) => {
      const newParams = new URLSearchParams(searchParams);
      
      if (value === null || value === undefined) {
        newParams.delete(key);
      } else if (value instanceof Date) {
        newParams.set(key, value.toISOString());
      } else if (Array.isArray(value)) {
        // Handle array values like tagIds
        newParams.delete(key);
        value.forEach(val => {
          newParams.append(key, val);
        });
      } else {
        newParams.set(key, String(value));
      }
      
      // Reset to first page when changing filters
      newParams.set("page", "1");
      
      setSearchParams(newParams, {
        replace: true,
        preventScrollReset: true
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
      preventScrollReset: true
    });
  }, [searchParams, setSearchParams]);

  const hasActiveFilters = useMemo(() => {
    return Object.keys(filters).length > 0;
  }, [filters]);

  return { filters, setFilter, clearFilters, hasActiveFilters };
}