export interface PaginationParams {
  page?: number;
  limit?: number;
}
export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
