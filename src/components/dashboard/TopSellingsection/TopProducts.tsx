import React, { useEffect, useState } from "react";

import { statisticsApi } from "@/api/statisticsApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { env } from "@/config/environment";
import { Box, ExternalLink } from "lucide-react";

interface TopProduct {
  productId: string;
  productName: string;
  totalSold: number;
  imageUrls: string[];
}

const TopProducts: React.FC = () => {
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await statisticsApi.getTop5Products();
        if (response.status === "success") {
          setTopProducts(response.data);
        } else {
          setError(
            response.message || "Erreur lors de la récupération des produits."
          );
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "Une erreur est survenue.");
        } else {
          setError("Une erreur est survenue.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Card className="w-full h-full flex items-center justify-center">
        <span>Chargement...</span>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full h-full flex items-center justify-center">
        <span>{error}</span>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Les 5 meilleurs Produits</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Column Labels - Hidden on mobile, visible on tablet and up */}
        <div className="hidden md:flex items-center justify-between py-2 border-b border-border">
          <span className="w-3/5 md:w-3/5 text-sm font-medium">Produit</span>
          <span className="w-1/5 md:w-1/5 text-sm font-medium">Ventes</span>
          <span className="w-1/5 md:w-1/5 text-right text-sm font-medium">
            Actions
          </span>
        </div>

        {/* Product List */}
        <ul className="divide-y divide-border">
          {topProducts.map((product, index) => {
            const productLink = `/products/${product.productId}`;

            return (
              <li
                key={index}
                className="flex flex-col items-start md:flex-row md:items-center justify-between py-4 space-y-2 md:space-y-0"
              >
                <div className="flex  w-full md:w-3/5 space-x-3">
                  {env.ENABLE_PRODUCT_IMAGES && (
                    <div>
                      {product.imageUrls && product.imageUrls.length > 0 ? (
                        <img
                          src={`${env.BACKEND_URL}/${product.imageUrls[0]}`}
                          alt={product.productName}
                          className="w-14 h-14 rounded-md object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 shrink-0 rounded-full bg-muted/50 flex items-center justify-center">
                          <Box />
                        </div>
                      )}
                    </div>
                  )}
                  <div className="w-full flex flex-col justify-between md:justify-center">
                    <span className="text-sm font-medium truncate text-wrap">
                      {product.productName}
                    </span>
                    <div className="flex justify-between md:hidden items-center w-full">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">
                          Ventes:
                        </span>
                        <span className="text-sm">{product.totalSold}</span>
                      </div>
                      <a
                        href={productLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/90"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout: Stats in columns */}
                <span className="hidden md:block w-1/5 text-sm text-muted-foreground">
                  {product.totalSold}
                </span>
                <a
                  href={productLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden md:block w-1/5 text-right text-primary hover:text-primary/90"
                >
                  <ExternalLink className="inline-block h-4 w-4" />
                </a>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
};

export default TopProducts;
