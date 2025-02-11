import ButtonGroup from "@/components/common/ButtonGroup";
import QuantityTag from "@/components/common/QuantityTag";
import StatusTag from "@/components/common/StatusTag";
import TableWrapper from "@/components/common/TableWrapper";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Category } from "@/types/category.dto";
import { Variant } from "@/types/variant.dto";
import getVariantQuantity from "@/utils/getVariantQuantity";

import DeleteVariantDialog from "../../delete/variant/DeleteVariantDialog";
import UpdateVariantDialog from "../../update/variant/UpdateVariantDialog";

export default function ProductVariantsTable({
  variants,
  category,
}: {
  variants: Variant[];
  category: Category;
}) {
  return (
    <TableWrapper>
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            {category.categoryAttributes.map((categoryAttribute) => (
              <TableHead
                key={categoryAttribute.id}
                className="whitespace-nowrap"
              >
                {categoryAttribute.attribute.name}
              </TableHead>
            ))}
            <TableHead className="text-center whitespace-nowrap">
              Quantité
            </TableHead>
            <TableHead className="w-32 text-center whitespace-nowrap">
              Statut
            </TableHead>
            <TableHead className="text-right whitespace-nowrap">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {variants.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={category.categoryAttributes.length + 3}
                className="py-8 text-center"
              >
                Aucune variante trouvé.
              </TableCell>
            </TableRow>
          ) : (
            variants.map((variant) => (
              <TableRow key={variant.id}>
                {category.categoryAttributes.map((categoryAttribute) => (
                  <TableCell
                    key={categoryAttribute.id}
                    className="whitespace-nowrap"
                  >
                    {
                      variant.attributeValues.find(
                        (attributeValue) =>
                          attributeValue.attributeId ===
                          categoryAttribute.attributeId
                      )?.value
                    }
                  </TableCell>
                ))}
                <TableCell className="text-center whitespace-nowrap">
                  <QuantityTag quantity={getVariantQuantity(variant)} />
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <StatusTag isActive={variant.isActive} />
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <ButtonGroup>
                    <UpdateVariantDialog variant={variant} />
                    <DeleteVariantDialog variant={variant} />
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableWrapper>
  );
}
