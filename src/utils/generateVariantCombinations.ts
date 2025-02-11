import { CategoryAttribute } from "@/types/categoryAttribute.dto";
import { ReducedCreateVariantDTO } from "@/types/variant.dto";

export default function generateVariantCombinations(
  attributes: CategoryAttribute[],
  attributeValues: ReducedCreateVariantDTO["attributeValues"]
) {
  return attributes
    .map((attr) => {
      const attributeId = attr.attribute.id;
      const values = attributeValues[attributeId] || [];
      return values.map((value) => ({ attributeId, value }));
    })
    .reduce<Array<Array<{ attributeId: string; value: string }>>>(
      (accumulatedCombinations, currentAttributeValues) =>
        accumulatedCombinations.flatMap((attributeValuePair) =>
          currentAttributeValues.map((attributeValue) => [
            ...attributeValuePair,
            attributeValue,
          ])
        ),
      [[]]
    );
}
