import { ApiErrorResponse } from "@/types/error.type";
import { AxiosError } from "axios";

export function getErrorMessage(error: AxiosError, fallBackMessage: string) {
  return (
    (error?.response?.data as ApiErrorResponse)?.message ?? fallBackMessage
  );
}
