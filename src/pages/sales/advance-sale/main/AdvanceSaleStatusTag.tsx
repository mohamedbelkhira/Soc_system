import SaleStatusTag from "@/components/common/SaleStatusTag";
import { AdvanceSaleStatus } from "@/schemas/sales/advance-sale.schema";
import getAdvanceSaleStatusIcon from "@/utils/status-transformers/advance-sale/getAdvanceSaleStatusIcon";
import getAdvanceSaleStatusLabel from "@/utils/status-transformers/advance-sale/getAdvanceSaleStatusLabel";
import getAdvanceSaleStatusScheme from "@/utils/status-transformers/advance-sale/getAdvanceSaleStatusScheme";

export default function AdvanceSaleStatusTag({
  status,
}: {
  status: AdvanceSaleStatus;
}) {
  const icon = getAdvanceSaleStatusIcon(status);
  return (
    <SaleStatusTag
      label={getAdvanceSaleStatusLabel(status)}
      icon={icon}
      scheme={getAdvanceSaleStatusScheme(status)}
    />
  );
}
