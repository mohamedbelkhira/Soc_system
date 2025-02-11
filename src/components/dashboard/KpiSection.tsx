import * as React from "react";
import { DateRange } from "react-day-picker";

import { Expense } from "@/types/expense.dto";
import { Purchase } from "@/types/purchase.dto";
import { AdvanceSale } from "@/types/sales/advance-sale.dto";
import { OnlineSale } from "@/types/sales/online-sale.dto";
import { StoreSale } from "@/types/sales/store-sale.dto";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { endOfDay, startOfDay, subDays } from "date-fns";
import { BadgeDollarSign, CreditCard, ShoppingBag, Wallet } from "lucide-react";

import DatePickerWithRange from "../common/DatePickerWithRange";
import FilterSelect from "../common/FilterSelect";
import KpiCard from "../common/KpiCard";

type FilterType = "TODAY" | "LAST_MONTH" | "LAST_YEAR" | "ALL_TIME" | "CUSTOM";

interface KpiSectionProps {
  purchases: Purchase[];
  storeSales: StoreSale[];
  onlineSales: OnlineSale[];
  advanceSales: AdvanceSale[];
  expenses: Expense[];
}

const KpiSection: React.FC<KpiSectionProps> = ({
  purchases,
  storeSales,
  onlineSales,
  advanceSales,
  expenses,
}) => {
  const [filterType, setFilterType] = React.useState<FilterType>("ALL_TIME");
  const [customRange, setCustomRange] = React.useState<DateRange | undefined>();

  // A small lookup array for the FilterSelect
  const filterOptions = React.useMemo(
    () => [
      { value: "ALL_TIME", label: "Tous les temps" },
      { value: "TODAY", label: "Aujourd'hui" },
      { value: "LAST_MONTH", label: "Mois dernier" },
      { value: "LAST_YEAR", label: "Dernière année" },
      { value: "CUSTOM", label: "Intervalle personnalisée" },
    ],
    []
  );

  // Compute date boundaries
  const { from: startDate, to: endDate } = React.useMemo(() => {
    const now = new Date();

    switch (filterType) {
      case "TODAY":
        return { from: startOfDay(now), to: endOfDay(now) };
      case "LAST_MONTH":
        return { from: subDays(now, 30), to: now };
      case "LAST_YEAR":
        return { from: subDays(now, 365), to: now };
      case "CUSTOM":
        return {
          from: customRange?.from ?? new Date(0),
          to: customRange?.to ?? now,
        };
      case "ALL_TIME":
      default:
        return { from: new Date(0), to: now };
    }
  }, [filterType, customRange]);

  const filteredPurchases = React.useMemo(() => {
    return purchases.filter((p) => {
      if (!p.createdAt) return true;
      const date = new Date(p.createdAt);
      return date >= (startDate || date) && date <= (endDate || date);
    });
  }, [purchases, startDate, endDate]);

  const filteredStoreSales = React.useMemo(() => {
    return storeSales.filter((s) => {
      if (!s.createdAt) return true;
      const date = new Date(s.createdAt);
      return date >= (startDate || date) && date <= (endDate || date);
    });
  }, [storeSales, startDate, endDate]);

  const filteredOnlineSales = React.useMemo(() => {
    return onlineSales.filter((s) => {
      if (!s.createdAt) return true;
      const date = new Date(s.createdAt);
      return date >= (startDate || date) && date <= (endDate || date);
    });
  }, [onlineSales, startDate, endDate]);

  const filteredAdvanceSales = React.useMemo(() => {
    return advanceSales.filter((s) => {
      if (!s.createdAt) return true;
      const date = new Date(s.createdAt);
      return date >= (startDate || date) && date <= (endDate || date);
    });
  }, [advanceSales, startDate, endDate]);

  const filteredExpenses = React.useMemo(() => {
    return expenses.filter((e) => {
      if (!e.createdAt) return true;
      const date = new Date(e.createdAt);
      return date >= (startDate || date) && date <= (endDate || date);
    });
  }, [expenses, startDate, endDate]);

  const allSales = React.useMemo(
    () => [
      ...filteredStoreSales,
      ...filteredOnlineSales,
      ...filteredAdvanceSales,
    ],
    [filteredStoreSales, filteredOnlineSales, filteredAdvanceSales]
  );

  const completedSales = React.useMemo(
    () => allSales.filter((s) => s.status === "COMPLETED"),
    [allSales]
  );

  const cancealedOnlineSales = React.useMemo(
    () => filteredOnlineSales.filter((s) => s.status === "RETURNED"),
    [filteredOnlineSales]
  );

  const advanceSalesPending = React.useMemo(
    () => filteredAdvanceSales.filter((s) => s.status === "PENDING"),
    [filteredAdvanceSales]
  );

  const tmpRevenuAdvanceSale = advanceSalesPending.reduce(
    (sum, sale) =>
      sum + Number(sale.paidAmount - (sale.sale.discountAmount ?? 0)),
    0
  );

  const totalRevenueGained = completedSales.reduce(
    (sum, sale) =>
      sum + Number(sale.sale.totalAmount - (sale.sale.discountAmount ?? 0)),
    0
  );

  const totalOnlineSalesReturn = cancealedOnlineSales.reduce(
    (sum, sale) => sum + Number(sale.returnCost || 0),
    0
  );

  const totalRevenu = totalRevenueGained + tmpRevenuAdvanceSale;
//purchases only handeling received purchases
  const RecievedPurchases = React.useMemo(
    () => filteredPurchases.filter((s) => s.state === "RECEIVED"),
    [filteredPurchases]
  );
  const totalPurchaseAmount = RecievedPurchases.reduce(
    (sum, purchase) => sum + Number(purchase.totalAmount || 0),
    0
  );
  
  const paidExpenses = React.useMemo(
    () => filteredExpenses.filter((e) => e.status === "PAID"),
    [filteredExpenses]
  );
  const totalExpensesAmount = paidExpenses.reduce(
    (sum, expense) => sum + Number(expense.amount || 0),
    0
  );

  const netProfit =
    totalRevenu -
    totalExpensesAmount -
    totalPurchaseAmount -
    totalOnlineSalesReturn;

  return (
    <div className="space-y-4">
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <FilterSelect
          label="Filtrer par date"
          placeholder="Select..."
          options={filterOptions}
          value={filterType}
          onChange={(val) => setFilterType(val as FilterType)}
        />

        {filterType === "CUSTOM" && (
          <DatePickerWithRange
            className="mt-5"
            value={customRange}
            onChange={setCustomRange}
          />
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
        <KpiCard
          index={2}
          title="Revenu total"
          icon={<BadgeDollarSign />}
          value={formatCurrency(totalRevenu)}
        />
        <KpiCard
          index={1}
          title="Prix des achats"
          icon={<ShoppingBag />}
          value={formatCurrency(totalPurchaseAmount)}
        />
        <KpiCard
          index={4}
          title="Prix des retours"
          icon={<BadgeDollarSign />}
          value={formatCurrency(totalOnlineSalesReturn)}
        />
        <KpiCard
          index={3}
          title="Prix des dépenses"
          icon={<CreditCard />}
          value={formatCurrency(totalExpensesAmount)}
        />
        <KpiCard
          index={0}
          title="Bénifice net"
          icon={<Wallet />}
          value={formatCurrency(netProfit)}
        />
      </div>
    </div>
  );
};

export default KpiSection;
