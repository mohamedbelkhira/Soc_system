import { AttributeType } from "@/schemas/attribute.schema";

export default function getAttributeTypeLabel(type: AttributeType) {
  switch (type) {
    case AttributeType.STRING:
      return "Texte";
    case AttributeType.NUMBER:
      return "Nombre";
  }
}
