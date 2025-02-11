import * as React from "react";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTheme } from "@/contexts/theme-provider";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import "dayjs/locale/fr";
import { StoreSale } from "@/types/sales/store-sale.dto";
import { OnlineSale } from "@/types/sales/online-sale.dto";
import { AdvanceSale } from "@/types/sales/advance-sale.dto";
import { formatCurrency } from "@/utils/formatters/formatCurrency";

dayjs.locale("fr");
dayjs.extend(isBetween);
interface IncomeOverviewProps {
  storeSales: StoreSale[];
  onlineSales: OnlineSale[];
  advanceSales: AdvanceSale[];
}

const incomeColor = "#4f46e5";
const dayOrder = ["samedi", "dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi"];

function getStartOfSamediWeek(d: dayjs.Dayjs): dayjs.Dayjs {
  const dayOfWeek = d.day(); 
  const diff = (dayOfWeek - 6 + 7) % 7;
  return d.subtract(diff, "day").startOf("day"); 
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  const { theme } = useTheme();
  if (active && payload && payload.length) {
    return (
      <div
        className={`p-2 rounded shadow-lg ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <p className="font-semibold">{label}</p>
        {// eslint-disable-next-line @typescript-eslint/no-explicit-any
        payload.map((data: any, index: number) => (
          <p key={index} style={{ color: data.color }}>
            {data.name}: {formatCurrency(data.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const IncomeOverview: React.FC<IncomeOverviewProps> = ({
  storeSales = [],
  onlineSales = [],
  advanceSales = [],
}) => {
  // Filter only COMPLETED sales
  const completedStoreSales = useMemo(
    () => storeSales.filter((s) => s.status === "COMPLETED"),
    [storeSales]
  );
  const completedOnlineSales = useMemo(
    () => onlineSales.filter((s) => s.status === "COMPLETED"),
    [onlineSales]
  );
  const completedAdvanceSales = useMemo(
    () => advanceSales.filter((s) => s.status === "COMPLETED"),
    [advanceSales]
  );

  const incomeData = useMemo(() => {
    const startOfWeek = getStartOfSamediWeek(dayjs());
    const endOfWeek = startOfWeek.add(6, "day").endOf("day");

    const allCompletedSales = [
      ...completedStoreSales,
      ...completedOnlineSales,
      ...completedAdvanceSales,
    ];

    const thisWeeksSales = allCompletedSales.filter((sale) => {
      if ('completedAt' in sale) {
        const saleDate = dayjs(sale.completedAt);
        return saleDate.isBetween(startOfWeek, endOfWeek, "day", "[]");
      } else {
        // For advance sales, use updatedAt
        const saleDate = dayjs(sale.updatedAt);
        return saleDate.isBetween(startOfWeek, endOfWeek, "day", "[]");
      }
    });
   
    const daysInWeek = [...Array(7)].map((_, i) => startOfWeek.add(i, "day"));

    const data = daysInWeek.map((d) => {
      const key = d.format("YYYY-MM-DD");
      const dailyRevenue = thisWeeksSales.reduce((acc, sale) => {
        const saleDate = 'completedAt' in sale 
          ? dayjs(sale.completedAt) 
          : dayjs(sale.updatedAt);
        
        const saleKey = saleDate.format("YYYY-MM-DD");
        if (saleKey === key) {
          const total = sale.sale.totalAmount - (sale.sale.discountAmount ?? 0);
          return acc + total;
        }
        return acc;
      }, 0);
      return {
        day: d.format("dddd"), // e.g. 'samedi', 'dimanche', ...
        income: dailyRevenue,
      };
    });

    // 6) Sort the data to match your custom day order
    data.sort(
      (a, b) =>
        dayOrder.indexOf(a.day.toLowerCase()) -
        dayOrder.indexOf(b.day.toLowerCase())
    );

    return data;
  }, [completedStoreSales, completedOnlineSales, completedAdvanceSales]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Aperçu des revenus</CardTitle>
        <CardDescription>Semaine de samedi à vendredi</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] sm:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={incomeData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              interval={0}
              tick={{ fontSize: 14 }}
              // For brevity, you could limit days to 3 letters:
              tickFormatter={(label) => label.slice(0, 3)}
            />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="income"
              fill={incomeColor}
              radius={[8, 8, 0, 0]}
              name="Revenu"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default IncomeOverview;
