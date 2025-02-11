import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTheme } from "@/contexts/theme-provider";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import "dayjs/locale/fr";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { OnlineSale } from "@/types/sales/online-sale.dto";
import { OnlineSaleChannel } from "@/types/sales/online-sale-channel.dto";

dayjs.extend(isBetween);
dayjs.locale("fr");

function getStartOfSamediWeek(d: dayjs.Dayjs): dayjs.Dayjs {
  const dayOfWeek = d.day();
  const diff = (dayOfWeek - 6 + 7) % 7;
  return d.subtract(diff, "day").startOf("day");
}

export type OnlineSaleWithChannel = OnlineSale & {
  channel: OnlineSaleChannel;
};

interface WeekChartData {
  day: string;
  [channel: string]: number | string;
}

interface MonthChartData {
  month: string;
  [channel: string]: number | string;
}

interface ChannelsSalesStatComponentProps {
  onlineSales: OnlineSaleWithChannel[];
}

interface TooltipProps {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any[];
  label?: string;
}

const generateChannelColors = (channels: string[]) => {
  const baseColors = ["#5E35B1", "#1E88E5", "#00897B", "#43A047", "#7B1FA2"];
  const colors: Record<string, string> = {};
  channels.forEach((channel, index) => {
    colors[channel] = baseColors[index % baseColors.length];
  });
  return colors;
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

const ChannelsSalesStat: React.FC<ChannelsSalesStatComponentProps> = ({
  onlineSales = [],
}) => {
  const [range, setRange] = useState<"week" | "month">("week");
  const { theme } = useTheme();

  // 1. Extract unique channels
  const channels = useMemo(() => {
    const uniqueChannels = Array.from(
      new Set(onlineSales.map((sale) => sale.channel?.name || "Unknown"))
    );
    return uniqueChannels;
  }, [onlineSales]);

  // 2. Generate color mapping for each channel
  const channelColors = useMemo(
    () => generateChannelColors(channels),
    [channels]
  );

  // 3. Keep track of which channels are currently active (visible)
  const [activeChannels, setActiveChannels] = useState<Record<string, boolean>>(
    {}
  );

  // Initialize activeChannels when channels change
  useEffect(() => {
    if (channels.length > 0) {
      // If a channel is not in the current state, default it to true
      setActiveChannels((prev) => {
        const nextState: Record<string, boolean> = { ...prev };
        channels.forEach((channel) => {
          if (nextState[channel] === undefined) {
            nextState[channel] = true;
          }
        });
        return nextState;
      });
    }
  }, [channels]);

  // Function to toggle a channel on/off
  const toggleChannel = (channel: string) => {
    setActiveChannels((prev) => ({
      ...prev,
      [channel]: !prev[channel],
    }));
  };

  // Filter out only completed sales
  const completedSales = useMemo(
    () => onlineSales.filter((s) => s.status === "COMPLETED"),
    [onlineSales]
  );

  // 4. Build the chart data based on `range` (week or month)
  const chartData = useMemo(() => {
    if (range === "week") {
      const startOfWeek = getStartOfSamediWeek(dayjs());
      const endOfWeek = startOfWeek.add(6, "day").endOf("day");

      const salesThisWeek = completedSales.filter((sale) => {
        const saleDate = dayjs(sale.completedAt);
        return saleDate.isBetween(startOfWeek, endOfWeek, "day", "[]");
      });

      const daysInWeek = [...Array(7)].map((_, i) => startOfWeek.add(i, "day"));

      const data: WeekChartData[] = daysInWeek.map((d) => {
        const key = d.format("YYYY-MM-DD");
        const daySales: WeekChartData = { day: d.format("dddd") };

        channels.forEach((channel) => {
          const count = salesThisWeek.filter(
            (sale) =>
              dayjs(sale.completedAt).format("YYYY-MM-DD") === key &&
              sale.channel?.name === channel
          ).length;
          daySales[channel] = count;
        });

        return daySales;
      });

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
      const startOfYear = dayjs().startOf("year");
      const endOfYear = dayjs().endOf("year");

      const salesThisYear = completedSales.filter((sale) => {
        const saleDate = dayjs(sale.completedAt);
        return saleDate.isBetween(startOfYear, endOfYear, "day", "[]");
      });

      const months = [...Array(12)].map((_, i) => startOfYear.add(i, "month"));

      const data: MonthChartData[] = months.map((m) => {
        const key = m.format("YYYY-MM");
        const monthSales: MonthChartData = { month: m.format("MMMM") };

        channels.forEach((channel) => {
          const count = salesThisYear.filter(
            (sale) =>
              dayjs(sale.completedAt).format("YYYY-MM") === key &&
              sale.channel?.name === channel
          ).length;
          monthSales[channel] = count;
        });

        return monthSales;
      });

      return data;
    }
  }, [range, completedSales, channels]);

  return (
    <Card className="w-full h-full">
      <CardHeader className="relative pb-2">
        <div>
          <CardTitle className="text-xl font-semibold">
            Ventes en ligne par canal
          </CardTitle>
          <CardDescription className="mt-1.5">
            Affichage des ventes en ligne par canal pour la{" "}
            {range === "week" ? "semaine en cours" : "l'année en cours"}
          </CardDescription>

          {/* Channel toggles (legend) */}
          <div className="mt-6 flex flex-wrap gap-6 justify-center">
            {channels.map((channel) => {
              const isActive = !!activeChannels[channel];
              return (
                <div
                  key={channel}
                  className="flex items-center gap-2 cursor-pointer group"
                  onClick={() => toggleChannel(channel)}
                >
                  <div
                    className={`w-4 h-4 rounded-md transition-all duration-200 ${
                      isActive ? "scale-100" : "scale-90 opacity-60"
                    } group-hover:scale-105`}
                    style={{
                      backgroundColor: isActive
                        ? channelColors[channel]
                        : `${channelColors[channel]}40`,
                    }}
                  />
                  <span
                    className={`text-sm transition-opacity duration-200 ${
                      isActive ? "opacity-100" : "opacity-60"
                    }`}
                  >
                    {channel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Toggle between week and month (year) */}
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
              {channels.map((channel) => (
                <linearGradient
                  key={channel}
                  id={`fill${channel}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="10%"
                    stopColor={channelColors[channel]}
                    stopOpacity={0.7}
                  />
                  <stop
                    offset="95%"
                    stopColor={channelColors[channel]}
                    stopOpacity={0.05}
                  />
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
                  // abbreviate day if screen is small
                  return isSmallScreen ? label.slice(0, 3) : label;
                } else {
                  // abbreviate month if screen is small
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

            {/* Conditionally render each channel's <Area> if it is active */}
            {channels.map((channel) =>
              activeChannels[channel] ? (
                <Area
                  key={channel}
                  dataKey={channel}
                  type="monotone"
                  fill={`url(#fill${channel})`}
                  stroke={channelColors[channel]}
                  strokeWidth={2}
                  stackId="a"
                  name={channel}
                />
              ) : null
            )}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ChannelsSalesStat;