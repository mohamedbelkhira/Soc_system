import { OnlineSaleStatus } from "@/schemas/sales/online-sale.schema";

import SaleStatusTag from "@/components/common/SaleStatusTag";
import getOnlineSaleStatusIcon from "@/utils/status-transformers/online-sale/getOnlineSaleStatusIcon";
import getOnlineSaleStatusLabel from "@/utils/status-transformers/online-sale/getOnlineSaleStatusLabel";
import getOnlineSaleStatusScheme from "@/utils/status-transformers/online-sale/getOnlineSaleStatusScheme";

export default function OnlineSaleStatusTag({
  status,
}: {
  status: OnlineSaleStatus;
}) {
  const icon = getOnlineSaleStatusIcon(status);
  return (
    <SaleStatusTag
      label={getOnlineSaleStatusLabel(status)}
      icon={icon}
      scheme={getOnlineSaleStatusScheme(status)}
    />
  );
}
