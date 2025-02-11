import * as React from "react"
import TopProducts from "./TopProducts";
import TopCategories from "./TopCategories";

const TopSellingSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <TopProducts />
      <TopCategories />
    </div>
  );
};

export default TopSellingSection;