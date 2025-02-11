import { useNavigate, useParams } from "react-router-dom";

import Page from "@/components/common/Page";
import { Skeleton } from "@/components/ui/skeleton";
import { useProduct } from "@/swr/products/product.swr";
import { useProductSales } from "@/swr/sales/sale.swr";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { showToast } from "@/utils/showToast";

import ProductVariantsCard from "../variants/ProductVariantsCard";
import ProductDetailsCard from "./ProductDetailsCard";
import ProductKpiCards from "./ProductKpiCards";

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, error } = useProduct(id!);
  const navigate = useNavigate();

  const { data: sales, isLoading: salesLoading } = useProductSales(id!);
  if (isLoading || salesLoading) {
    return (
      <div className="mx-auto space-y-6">
        <Skeleton className="h-[400px] w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (error) {
    showToast(
      "error",
      getErrorMessage(error, "Échec lors du chargement du produit")
    );
    navigate("/products");
    return;
  }

  if (!product) {
    showToast("error", "Échec lors du chargement du produit");
    navigate("/products");
    return;
  }

  return (
    <Page title={`Produit "${product.name}"`} backButtonHref="/products">
      <ProductKpiCards product={product} sales={sales} />
      <ProductDetailsCard product={product} />
      {product.hasVariants && (
        <ProductVariantsCard product={product} category={product.category} />
      )}
    </Page>
  );
}
