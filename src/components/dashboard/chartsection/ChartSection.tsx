import { AdvanceSale } from "@/types/sales/advance-sale.dto";
import { OnlineSale } from "@/types/sales/online-sale.dto";
import { StoreSale } from "@/types/sales/store-sale.dto";

import AreaChartComponent from "./AreaChartComponent";
import IncomeOverview from "./IncomeOverview";

interface ChartSectionProps {
  storeSales: StoreSale[];
  onlineSales: OnlineSale[];
  advanceSales: AdvanceSale[];
}

const ChartSection: React.FC<ChartSectionProps> = ({
  storeSales,
  onlineSales,
  advanceSales,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
        <AreaChartComponent
          storeSales={storeSales}
          onlineSales={onlineSales}
          advanceSales={advanceSales}
        />
      </div>
      <div className="lg:col-span-1">
        <IncomeOverview
          storeSales={storeSales}
          onlineSales={onlineSales}
          advanceSales={advanceSales}
        />
      </div>
    </div>
  );
};

export default ChartSection;
