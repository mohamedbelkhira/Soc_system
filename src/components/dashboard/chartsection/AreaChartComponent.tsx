import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card";
import { useTheme } from "@/contexts/theme-provider";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import "dayjs/locale/fr";

import { Area,AreaChart, CartesianGrid,ResponsiveContainer,Tooltip,XAxis,YAxis,} from "recharts";
import { StoreSale } from "@/types/sales/store-sale.dto";
import { OnlineSale } from "@/types/sales/online-sale.dto";
import { AdvanceSale } from "@/types/sales/advance-sale.dto";

dayjs.extend(isBetween);
dayjs.locale("fr");

function getStartOfSamediWeek(d: dayjs.Dayjs): dayjs.Dayjs {
  const dayOfWeek = d.day();
  const diff = (dayOfWeek - 6 + 7) % 7;
  return d.subtract(diff, "day").startOf("day");
}

interface AreaChartComponentProps {
  storeSales: StoreSale[];
  onlineSales: OnlineSale[];
  advanceSales: AdvanceSale[];
}

interface TooltipProps {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any[];
  label?: string;
}

const colors = {
  online: "#5E35B1",
  advance: "#1E88E5",
  store: "#00897B",
};

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  const { theme } = useTheme();
  if (active && payload && payload.length) {
    return (
      <div
        className={`p-4 rounded-lg shadow-lg border ${
          theme === "dark"
            ? "bg-gray-800/90 text-white border-gray-700"
            : "bg-white/90 text-gray-800 border-gray-200"
        } backdrop-blur-sm`}
      >
        <p className="font-semibold mb-2 text-sm">{label}</p>
        {payload.map((data, index) => (
          <div key={index} className="flex items-center space-x-2 py-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: data.color }}
            />
            <p className="text-sm">
              <span className="opacity-75">{data.name}:</span>{" "}
              <span className="font-medium">{data.value}</span>
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const AreaChartComponent: React.FC<AreaChartComponentProps> = ({
  storeSales = [],
  onlineSales = [],
  advanceSales = [],
}) => {
  const [range, setRange] = useState<"week" | "month">("week");
  const [showOnline, setShowOnline] = useState(true);
  const [showAdvance, setShowAdvance] = useState(true);
  const [showStore, setShowStore] = useState(true);
  const { theme } = useTheme();

  // Filter only COMPLETED
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

  // Combined
  const allCompletedSales = useMemo(
    () => [
      ...completedStoreSales,
      ...completedOnlineSales,
      ...completedAdvanceSales,
    ],
    [completedStoreSales, completedOnlineSales, completedAdvanceSales]
  );

  const chartData = useMemo(() => {
    if (range === "week") {
      // 1) Current week: samedi → vendredi
      const startOfWeek = getStartOfSamediWeek(dayjs());
      const endOfWeek = startOfWeek.add(6, "day").endOf("day");

      // Filter to keep only current week's sales
      const salesThisWeek = allCompletedSales.filter((sale) => {
        if ('completedAt' in sale) {
          const saleDate = dayjs(sale.completedAt);
          return saleDate.isBetween(startOfWeek, endOfWeek, "day", "[]");
        } else {
          // For advance sales, use updatedAt
          const saleDate = dayjs(sale.updatedAt);
          return saleDate.isBetween(startOfWeek, endOfWeek, "day", "[]");
        }
      });

      // Build the 7 days array from samedi..vendredi
      const daysInWeek = [...Array(7)].map((_, i) =>
        startOfWeek.add(i, "day")
      );

      // Count how many sales for each category, by day
      const data = daysInWeek.map((d) => {
        const key = d.format("YYYY-MM-DD");
        const storeCount = salesThisWeek.filter(
          (sale) =>
            'completedAt' in sale && 
            dayjs(sale.completedAt).format("YYYY-MM-DD") === key &&
            storeSales.some(storeSale => storeSale.id === sale.id)
        ).length;
      
        const onlineCount = salesThisWeek.filter(
          (sale) =>
            'completedAt' in sale && 
            dayjs(sale.completedAt).format("YYYY-MM-DD") === key &&
            onlineSales.some(onlineSale => onlineSale.id === sale.id)
        ).length;
      
        const advanceCount = salesThisWeek.filter(
          (sale) =>
            dayjs(sale.updatedAt).format("YYYY-MM-DD") === key &&
            advanceSales.some(advanceSale => advanceSale.id === sale.id)
        ).length;

        return {
          day: d.format("dddd"), // e.g. 'samedi', 'dimanche', ...
          online: onlineCount,
          advance: advanceCount,
          store: storeCount,
        };
      });

      // If you want to reorder days, for instance [samedi, dimanche, ...]
      const dayOrder = [
        "samedi",
        "dimanche",
        "lundi",
        "mardi",
        "mercredi",
        "jeudi",
        "vendredi",
      ];
      data.sort(
        (a, b) =>
          dayOrder.indexOf(a.day.toLowerCase()) -
          dayOrder.indexOf(b.day.toLowerCase())
      );
      return data;
    } else {
      // 2) Current year: january → december
      const startOfYear = dayjs().startOf("year");
      const endOfYear = dayjs().endOf("year");

      // Filter to keep only sales in the current year
      const salesThisYear = allCompletedSales.filter((sale) => {
        const saleDate = dayjs(sale.updatedAt);
        return saleDate.isBetween(startOfYear, endOfYear, "day", "[]");
      });

      // Build an array of months from Jan..Dec
      const months = [...Array(12)].map((_, i) =>
        startOfYear.add(i, "month")
      );

      const data = months.map((m) => {
        const key = m.format("YYYY-MM"); // e.g. "2023-01"
        const storeCount = salesThisYear.filter(
          (sale) =>
            'completedAt' in sale && 
          dayjs(sale.completedAt).format("YYYY-MM") === key &&
          storeSales.some(storeSale => storeSale.id === sale.id)
      ).length;
        
        const onlineCount = salesThisYear.filter(
          (sale) =>
           'completedAt' in sale && 
            dayjs(sale.completedAt).format("YYYY-MM") === key &&
            onlineSales.some(onlineSale => onlineSale.id === sale.id)
        ).length;

        const advanceCount = salesThisYear.filter(
          (sale) =>
            dayjs(sale.updatedAt).format("YYYY-MM") === key &&
            advanceSales.some(advanceSale => advanceSale.id === sale.id)
        ).length;

        return {
          month: m.format("MMMM"), // 'janvier', 'février', etc.
          online: onlineCount,
          advance: advanceCount,
          store: storeCount,
        };
      });

      return data;
    }
  }, [
    range,
    allCompletedSales,
    storeSales,
    onlineSales,
    advanceSales,
  ]);

  return (
    <Card className="w-full h-full">
      <CardHeader className="relative pb-2">
        <div>
          <CardTitle className="text-xl font-semibold">
            Nombre de ventes
          </CardTitle>
          <CardDescription className="mt-1.5">
            Affichage des ventes terminées pour la{" "}
            {range === "week" ? "semaine en cours" : "l'année en cours"}
          </CardDescription>

          {/* Toggles for each category */}
          <div className="mt-6 flex flex-wrap gap-6 justify-center">
            {[
              {
                key: "online",
                label: "En ligne",
                state: showOnline,
                setState: setShowOnline,
              },
              {
                key: "advance",
                label: "Avancée",
                state: showAdvance,
                setState: setShowAdvance,
              },
              {
                key: "store",
                label: "En magasin",
                state: showStore,
                setState: setShowStore,
              },
            ].map(({ key, label, state, setState }) => (
              <label
                key={key}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <div
                  className={`w-4 h-4 rounded-md transition-all duration-200 ${
                    state ? "scale-100" : "scale-90 opacity-60"
                  } hover:scale-105`}
                  onClick={() => setState(!state)}
                  style={{
                    backgroundColor: state
                      ? colors[key as keyof typeof colors]
                      : `${colors[key as keyof typeof colors]}40`,
                  }}
                />
                <span
                  className={`text-sm transition-opacity duration-200 ${
                    state ? "opacity-100" : "opacity-60"
                  }`}
                >
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Range toggle: "week" vs. "month" (used for current year) */}
        <div className="mt-2 flex gap-1 justify-start sm:justify-end">
          {["week", "month"].map((type) => (
            <Button
              key={type}
              onClick={() => setRange(type as "week" | "month")}
              variant={range === type ? "default" : "ghost"}
              className="text-sm px-3 py-1 h-8"
              size="sm"
            >
              {type === "week" ? "Semaine" : "Année"}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="h-[400px] pt-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 20, right: 25, left: -10, bottom: 20 }}
          >
            <defs>
              {Object.entries(colors).map(([key, color]) => (
                <linearGradient
                  key={key}
                  id={`fill${key.charAt(0).toUpperCase() + key.slice(1)}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="10%" stopColor={color} stopOpacity={0.7} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.05} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke={theme === "dark" ? "#ffffff15" : "#00000035"}
            />
            <XAxis
              dataKey={range === "week" ? "day" : "month"}
              tickLine={false}
              axisLine={false}
              interval={0}
              tickFormatter={(label) => {
                const isSmallScreen =
                  typeof window !== "undefined" && window.innerWidth < 640;
                if (range === "week") {
                  return isSmallScreen ? label.slice(0, 3) : label;
                } else {
                  return isSmallScreen ? label.slice(0, 1) : label;
                }
              }}
              tick={{
                fontSize: 14,
                fill: theme === "dark" ? "#ffffff90" : "#00000090",
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{
                fontSize: 14,
                fill: theme === "dark" ? "#ffffff90" : "#00000090",
              }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: theme === "dark" ? "#ffffff30" : "#00000030" }}
            />

            {showOnline && (
              <Area
                dataKey="online"
                type="monotone"
                fill="url(#fillOnline)"
                stroke={colors.online}
                strokeWidth={2}
                stackId="a"
                name="En ligne"
              />
            )}
            {showAdvance && (
              <Area
                dataKey="advance"
                type="monotone"
                fill="url(#fillAdvance)"
                stroke={colors.advance}
                strokeWidth={2}
                stackId="a"
                name="Avancée"
              />
            )}
            {showStore && (
              <Area
                dataKey="store"
                type="monotone"
                fill="url(#fillStore)"
                stroke={colors.store}
                strokeWidth={2}
                stackId="a"
                name="En magasin"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AreaChartComponent;