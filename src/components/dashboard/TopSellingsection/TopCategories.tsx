import { useEffect, useState } from "react";
import { Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { statisticsApi } from "@/api/statisticsApi";

// Predefined colors for categories
const categoryColors = [
  "#4f46e5",  // Indigo
  "#ec4899",  // Pink
  "#10b981",  // Emerald
  "#f59e0b",  // Amber
  "#3b82f6",  // Blue
];

const TopCategories = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryData, setCategoryData] = useState<Array<{
    category: string;
    sales: number;
    fill: string;
  }>>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await statisticsApi.getTop5Categories();
        console.log("category response", response);
        
        if (response.status === "success" && response.data) {
          // Transform API data to match chart format
          const formattedData = response.data.map((item, index) => ({
            category: item.categoryName,
            sales: item.totalSold,
            fill: categoryColors[index % categoryColors.length],
          }));
          setCategoryData(formattedData);
        } else {
          setError("Failed to load category data");
        }
      } catch (err) {
        setError("Error fetching category data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Generate chart config from dynamic data
  const chartConfig = Object.fromEntries(
    categoryData.map((item, index) => [
      item.category,
      {
        label: item.category,
        color: `hsl(var(--chart-${index + 1}))`,
      },
    ])
  );

  if (loading) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center">
          <CardTitle>Les 5 meilleurs catégories de produits</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center">
        <CardTitle>Les 5 meilleurs catégories de produits</CardTitle>
          <CardDescription className="text-red-500">{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
      <CardTitle>Les 5 meilleurs catégories de produits</CardTitle>
        <CardDescription>Aperçu de l'année en cours</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[350px]"
        >
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={categoryData}
              dataKey="sales"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={130}
              innerRadius={40}
              fill="#8884d8"
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="category" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default TopCategories;