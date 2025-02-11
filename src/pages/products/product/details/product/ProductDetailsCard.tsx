import ButtonGroup from "@/components/common/ButtonGroup";
import DeleteButton from "@/components/common/DeleteButton";
import ImagesCarousel from "@/components/common/ImagesCarousel";
import UpdateButton from "@/components/common/UpdateButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { env } from "@/config/environment";
import { Product } from "@/types/product.dto";
import clsx from "clsx";

import DeleteProductDialog from "../../delete/product/DeleteProductDialog";
import ProductInformationCards from "./ProductInformationCards";

export default function ProductDetailsCard({ product }: { product: Product }) {
  console.log("ENABLE PRODUCT IMAGES", import.meta.env.ENABLE_PRODUCT_IMAGES);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Détails du produit</CardTitle>
          <ButtonGroup>
            <UpdateButton
              label="Mettre à jour"
              href={`/products/${product.id}/edit`}
            />
            <DeleteProductDialog
              product={product}
              trigger={<DeleteButton label="Supprimer" />}
            />
          </ButtonGroup>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          className={clsx(
            { "grid md:grid-cols-2 gap-12": env.ENABLE_PRODUCT_IMAGES },
            {
              "grid gap-6": !env.ENABLE_PRODUCT_IMAGES,
            }
          )}
        >
          {env.ENABLE_PRODUCT_IMAGES && (
            <ImagesCarousel imageUrls={product.imageUrls} />
          )}
          <div className="grid gap-6">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <div
                  className={clsx(
                    "px-4 py-1.5 bg-green-100 text-green-600 rounded-full text-sm font-semibold",
                    { "": !product.isActive }
                  )}
                >
                  {product.isActive ? "Actif" : "Inactif"}
                </div>
              </div>

              <p>{product.description}</p>
            </div>

            <ProductInformationCards product={product} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
