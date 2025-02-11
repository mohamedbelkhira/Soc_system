import SaleStatusTag from "@/components/common/SaleStatusTag";
import { StoreSaleStatus } from "@/schemas/sales/store-sale.schema";
import getStoreSaleStatusIcon from "@/utils/status-transformers/store-sale/getStoreSaleStatusIcon";
import getStoreSaleStatusLabel from "@/utils/status-transformers/store-sale/getStoreSaleStatusLabel";
import getStoreSaleStatusScheme from "@/utils/status-transformers/store-sale/getStoreSaleStatusScheme";

export default function StoreSaleStatusTag({
  status,
}: {
  status: StoreSaleStatus;
}) {
  const icon = getStoreSaleStatusIcon(status);
  return (
    <SaleStatusTag
      label={getStoreSaleStatusLabel(status)}
      icon={icon}
      scheme={getStoreSaleStatusScheme(status)}
    />
  );
}
