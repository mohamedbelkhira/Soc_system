import { CategoryAttribute } from "@/types/categoryAttribute.dto";

export default function categoryAttributesToAttributeIds(
  categoryAttributes: CategoryAttribute[]
) {
  return categoryAttributes.map(
    (categoryAttribute) => categoryAttribute.attributeId
  );
}
