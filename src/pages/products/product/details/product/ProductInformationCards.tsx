import InformationCard from "@/components/common/InformationCard";
import { env } from "@/config/environment";
import { Product } from "@/types/product.dto";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import clsx from "clsx";
import { DollarSign, Package, SwatchBook, Tag, Weight } from "lucide-react";

export default function ProductInformationCards({
  product,
}: {
  product: Product;
}) {
  return (
    <div
      className={clsx(
        {
          "grid grid-cols-2 gap-3": !env.ENABLE_PRODUCT_IMAGES,
        },
        { "grid gap-3": env.ENABLE_PRODUCT_IMAGES }
      )}
    >
      <InformationCard icon={Tag} label="Marque" value={product.brand} />
      <InformationCard
        icon={Package}
        label="Catégorie"
        value={product.category.name}
      />
      <InformationCard
        icon={SwatchBook}
        label="Variantes"
        value={
          product.hasVariants
            ? product.variants.length.toString()
            : "Sans Variantes"
        }
      />
      {env.ENABLE_PRODUCT_WEIGHT && (
        <InformationCard
          icon={Weight}
          label="Poids"
          value={product.weight + " (g)"}
        />
      )}
      <InformationCard
        icon={DollarSign}
        label="Prix"
        value={formatCurrency(product.retailPrice)}
      />
    </div>
  );
}
