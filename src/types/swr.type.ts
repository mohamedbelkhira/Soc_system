import { AxiosError } from "axios";

import { ApiResponse } from "./api.type";

export type UsePaginatedItems<T> = {
  data: T[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: AxiosError | null;
};

export type UseItems<T> = {
  data: T[];
  isLoading: boolean;
  error: AxiosError | null;
};

export type UseItem<T> = {
  data: T | null;
  isLoading: boolean;
  error: AxiosError | null;
};

export type UseCreate<T, CreateTDO> = {
  create: (data: CreateTDO) => Promise<ApiResponse<T>>;
  isCreating: boolean;
  error: AxiosError | null;
};

export type UseUpdate<T, UpdateDTO> = {
  update: (data: UpdateDTO) => Promise<ApiResponse<T>>;
  isUpdating: boolean;
  error: AxiosError | null;
};

export type UseFetchAndUpdate<T, UpdateDTO> = {
  data: T | null;
  isLoading: boolean;
  update: (data: UpdateDTO) => Promise<ApiResponse<T>>;
  isUpdating: boolean;
  error: AxiosError | null;
};

export type UseDelete<T> = {
  delete: () => Promise<ApiResponse<T>>;
  isDeleting: boolean;
  error: AxiosError | null;
};
