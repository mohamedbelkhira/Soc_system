import * as React from "react"
import ChannelsSalesStat from "./ChannelsSalesStat";
import { OnlineSale } from "@/types/sales/online-sale.dto";
import ChannelsSalesPourcentage from "./ChannelsSalesPourcentage";


interface ChannelsSectionProps {
    onlineSales: OnlineSale[];
  }

const ChannelSection: React.FC<ChannelsSectionProps> = ({
    onlineSales,
  }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
      <ChannelsSalesStat onlineSales={onlineSales} />
      </div>
      <div className="lg:col-span-1">
        <ChannelsSalesPourcentage onlineSales={onlineSales} />
      </div>
    </div>
   
  );
};

export default ChannelSection;
