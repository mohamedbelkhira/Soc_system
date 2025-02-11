import { useMemo } from "react";
import { Label, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTheme } from "@/contexts/theme-provider";

import { OnlineSaleWithChannel } from "./ChannelsSalesStat";

interface ChannelsSalesPourcentageProps {
  onlineSales: OnlineSaleWithChannel[];
}

interface CustomTooltipProps {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any[];
}

const generateChannelColors = (channels: string[]) => {
  const baseColors = ["#5E35B1", "#1E88E5", "#00897B", "#43A047", "#7B1FA2"];
  return channels.reduce((acc, channel, index) => {
    acc[channel] = baseColors[index % baseColors.length];
    return acc;
  }, {} as Record<string, string>);
};

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  const { theme } = useTheme();

  if (active && payload && payload.length) {
    // The payload from Recharts includes our data object in "payload[0].payload"
    const data = payload[0].payload;
    const percentage = ((data.sales / data.totalSales) * 100).toFixed(1);

    return (
      <div
        className={`p-3 rounded-lg shadow-lg border ${
          theme === "dark"
            ? "bg-gray-800/90 text-white border-gray-700"
            : "bg-white/90 text-gray-800 border-gray-200"
        } backdrop-blur-sm`}
      >
        {/* Flex row with a colored square + channel name */}
        <p className="flex items-center font-semibold mb-1 gap-2">
          <span
            className="w-3 h-3 rounded-sm inline-block"
            style={{ backgroundColor: data.fill }}
          />
          {data.channel}
        </p>
        <p className="text-sm">
          {data.sales} ventes ({percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

const ChannelsSalesPourcentage: React.FC<ChannelsSalesPourcentageProps> = ({
  onlineSales = [],
}) => {
  const { theme } = useTheme();

  const { chartData, totalSales, channels } = useMemo(() => {
    const completedSales = onlineSales.filter((s) => s.status === "COMPLETED");
    const uniqueChannels = Array.from(
      new Set(completedSales.map((sale) => sale.channel?.name || "Unknown"))
    );

    // Build colors once per unique channel
    const channelColors = generateChannelColors(uniqueChannels);

    const data = uniqueChannels.map((channel) => {
      const salesCount = completedSales.filter(
        (sale) => sale.channel?.name === channel
      ).length;

      return {
        channel,
        sales: salesCount,
        totalSales: completedSales.length, // for calculating %
        fill: channelColors[channel],
      };
    });

    return {
      chartData: data,
      totalSales: completedSales.length,
      channels: uniqueChannels,
    };
  }, [onlineSales]);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-xl font-semibold">Répartition des ventes</CardTitle>
        <CardDescription className="mt-1.5">
          Distribution des ventes par canal
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              {/* Recharts Tooltip with our custom content */}
              <Tooltip content={<CustomTooltip />} />

              <Pie
                data={chartData}
                dataKey="sales"
                nameKey="channel"
                innerRadius={70}
                outerRadius={100}
                strokeWidth={5}
                stroke={theme === "dark" ? "#1e1e1e" : "#ffffff"}
              >
                <Label
                  content={({ viewBox }) => {
                    
                    if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null;
                    
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalSales}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy + 24}
                          className="fill-muted-foreground text-sm"
                        >
                          Ventes
                        </tspan>
                      </text>
                    );
                  }}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Simple legend below the chart */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {channels.map((channel) => {
            const slice = chartData.find((d) => d.channel === channel);
            return (
              <div key={channel} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: slice?.fill }}
                />
                <span className="text-sm">{channel}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChannelsSalesPourcentage;