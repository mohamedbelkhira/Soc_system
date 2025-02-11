import KpiCard from "@/components/common/KpiCard";
import { env } from "@/config/environment";
import { Product } from "@/types/product.dto";
import { Sale } from "@/types/sales/sale.dto";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import getProductQuantity from "@/utils/getProductQuantity";
import getVariantQuantity from "@/utils/getVariantQuantity";
import clsx from "clsx";
import { Package, ShoppingBag, TrendingDown, Wallet } from "lucide-react";
import { twMerge } from "tailwind-merge";

const ProductKpiCards = ({
  product,
  sales = [],
}: {
  product: Product;
  sales: Sale[] | null;
}) => {
  const calculateTotalSales = () => {
    return (sales ?? [])
      .map((sale) =>
        sale.stockMovement.items
          .filter((item) =>
            product.variants
              .map((variant) => variant.id)
              .includes(item.variantId)
          )
          .reduce((sum, item) => sum + item.quantity, 0)
      )
      .reduce((sum, subtotal) => sum + subtotal, 0);
  };

  const calculateTotalProfit = () => {
    return (sales ?? [])
      .map((sale) =>
        sale.stockMovement.items
          .filter((item) =>
            product.variants
              .map((variant) => variant.id)
              .includes(item.variantId)
          )
          .reduce((sum, item) => {
            const shippingCost =
              item.variant.product.weight *
              (item.purchaseItem.purchase.costPerKg ?? env.COST_PER_KG / 1000);
            return (
              sum +
              item.quantity *
                (item.price - item.purchaseItem.unitCost - shippingCost)
            );
          }, 0)
      )
      .reduce((sum, subtotal) => sum + subtotal, 0);
  };

  return (
    <div
      className={twMerge(
        clsx("grid gap-4 md:grid-cols-2 lg:grid-cols-4", {
          "lg:grid-cols-3": !product.hasVariants,
        })
      )}
    >
      <KpiCard
        index={0}
        title="En stock"
        icon={<Package />}
        value={getProductQuantity(product).toString()}
      />
      {product.hasVariants && (
        <KpiCard
          index={1}
          title="Rupture de stock"
          icon={<TrendingDown />}
          value={product.variants
            .filter(
              (variant) =>
                getVariantQuantity(variant) <= env.LOW_STOCK_THRESHOLD
            )
            .length.toString()}
        />
      )}
      <KpiCard
        index={2}
        title="Ventes"
        icon={<ShoppingBag />}
        value={calculateTotalSales().toString()}
      />
      <KpiCard
        index={3}
        title="Bénéfice total"
        icon={<Wallet />}
        value={formatCurrency(calculateTotalProfit())}
      />
    </div>
  );
};

export default ProductKpiCards;
