import { Product } from "@/types/product.dto";

export default function getProductQuantity(product: Product) {
  return product.currentStock.reduce((sum, stock) => sum + stock.quantity, 0);
}
