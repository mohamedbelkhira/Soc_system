export interface ApiResponse<T> {
  status: "success" | "error";
  message?: string;
  data: T;
}

export interface PaginatedApiResponse<T> {
  status: "success" | "error";
  message?: string;
  data: PaginatedResponse<T>;
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
