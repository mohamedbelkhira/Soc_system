import { useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

interface PaginationParams {
  page?: number;
  limit?: number;
}

export function usePagination(defaultLimit = 10) {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    let hasChanges = false;

    if (!searchParams.has("page")) {
      newParams.set("page", "1");
      hasChanges = true;
    }

    if (!searchParams.has("limit")) {
      newParams.set("limit", defaultLimit.toString());
      hasChanges = true;
    }

    if (hasChanges) {
      setSearchParams(newParams, { replace: false });
    }
  }, [searchParams, setSearchParams, defaultLimit]);

  const paginationParams = useMemo((): PaginationParams => {
    const params: PaginationParams = {};

    const page = searchParams.get("page");
    if (page) {
      const pageNumber = parseInt(page, 10);
      if (!isNaN(pageNumber) && pageNumber > 0) {
        params.page = pageNumber;
      }
    }

    const limit = searchParams.get("limit");
    if (limit) {
      const limitNumber = parseInt(limit, defaultLimit);
      if (!isNaN(limitNumber) && limitNumber > 0) {
        params.limit = limitNumber;
      }
    }

    return params;
  }, [searchParams]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("page", newPage.toString());
      setSearchParams(newParams, { replace: false });
    },
    [searchParams, setSearchParams]
  );

  const handleLimitChange = useCallback(
    (newLimit: number) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("limit", newLimit.toString());
      newParams.set("page", "1");
      setSearchParams(newParams, { replace: false });
    },
    [searchParams, setSearchParams]
  );

  return {
    currentPage: paginationParams.page || 1,
    limit: paginationParams.limit || defaultLimit,
    handlePageChange,
    handleLimitChange,
  };
}
