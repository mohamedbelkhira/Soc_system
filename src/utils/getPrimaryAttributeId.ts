import { CategoryAttribute } from "@/types/categoryAttribute.dto";

export default function getPrimaryAttributeId(
  categoryAttributes: CategoryAttribute[]
) {
  return categoryAttributes.find(
    (categoryAttribute) => categoryAttribute.isPrimary
  )?.attributeId;
}
