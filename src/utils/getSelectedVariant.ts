import { Variant } from "@/types/variant.dto";

export default function getSelectedVariant(
  variantId: string,
  variants: Variant[]
): Variant | undefined {
  return variants.find((variant) => variant.id === variantId);
}
