import { Variant } from "@/types/variant.dto";

export default function getVariantName(variant: Variant): string {
  if (variant.attributeValues.length === 0) {
    return "-";
  }
  return variant.attributeValues
    .map((attributeValue) => {
      return attributeValue.value;
    })
    .join(", ");
}
