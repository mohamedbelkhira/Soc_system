import { Badge } from "../ui/badge";

export default function QuantityTag({ quantity }: { quantity: number }) {
  return (
    <Badge variant={quantity > 5 ? "default" : "destructive"}>{quantity}</Badge>
  );
}
