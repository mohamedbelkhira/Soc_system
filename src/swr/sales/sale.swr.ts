import salesApi from "@/api/sales/sale.api";
import { Sale } from "@/types/sales/sale.dto";
import { UseItem } from "@/types/swr.type";
import { AxiosError } from "axios";
import useSWR from "swr";

const SALES_KEY = "sales";

const getProductSalesKey = (id: string) => {
  return `${SALES_KEY}/product/${id}`;
};

export const useProductSales = (id: string): UseItem<Sale[]> => {
  const { data, error, isLoading } = useSWR(
    getProductSalesKey(id),
    () => salesApi.getByProductId(id),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );
  return {
    data: data?.data ?? null,
    isLoading,
    error: error as AxiosError | null,
  };
};
