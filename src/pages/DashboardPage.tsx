import KpiSection from "@/components/dashboard/KpiSection";
import TopSellingSection from "@/components/dashboard/TopSellingsection/TopSellingSection";
import ChartSection from "@/components/dashboard/chartsection/ChartSection";
import { useExpenses } from "@/swr/expense.swr";
import { usePurchases } from "@/swr/purchase.swr";
import { useAdvanceSales } from "@/swr/sales/advance-sale.swr";
import { useOnlineSales } from "@/swr/sales/online-sale.swr";
import { useStoreSales } from "@/swr/sales/store-sale.swr";
import { useCurrentEmployee } from "@/utils/useCurrentEmployee";
import { Separator } from "@radix-ui/react-separator";
import ChannelSection from "@/components/dashboard/topsellingchannels/ChannelSection";

const DashboardPage = () => {
  // Create empty URLSearchParams for each hook if you don't need filters
  const emptyParams = new URLSearchParams();
  const employee = useCurrentEmployee();
  console.log("current employee", employee);
  // Adjust destructuring according to the changed return signatures

  const { data: purchases, isLoading: loadingPurchases } =
    usePurchases(emptyParams);

  const { data: storeSales, isLoading: loadingStoreSales } =
    useStoreSales(emptyParams);
  const { data: onlineSales, isLoading: loadingOnlineSales } =
    useOnlineSales(emptyParams);
  const { data: advanceSales, isLoading: loadingAdvanceSales } =
    useAdvanceSales(emptyParams);
  const {
    data: expenses,
    isLoading: loadingExpenses,
  } = useExpenses(emptyParams); // Add expenses hook

  const isLoading =
    loadingPurchases ||
    loadingStoreSales ||
    loadingOnlineSales ||
    loadingAdvanceSales ||
    loadingExpenses;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <KpiSection
        purchases={purchases}
        storeSales={storeSales}
        onlineSales={onlineSales}
        advanceSales={advanceSales}
        expenses={expenses}
      />

      <Separator className="mt-10" />

      <ChartSection
        storeSales={storeSales}
        onlineSales={onlineSales}
        advanceSales={advanceSales}
      />
    <Separator className="mt-10" />
    <ChannelSection  onlineSales={onlineSales}
      />
      <TopSellingSection />
    </div>
  );
};

export default DashboardPage;
