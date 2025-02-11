import { Product } from "@/types/product.dto";

export default function getSelectedProduct(
  productId: string,
  products: Product[]
): Product | undefined {
  return products.find((product) => product.id === productId);
}
