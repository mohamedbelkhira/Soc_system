import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Assuming you have the cn utility from shadcn

const colors = [
  ["#5E35B1", "#512DA8", "#4527A0"],
  ["#1E88E5", "#1976D2", "#1565C0"],
  ["#00897B", "#00796B", "#00695C"],
  ["#F4511E", "#E64A19", "#D84315"],
  ["#E53935", "#D32F2F", "#C62828"],
];

interface KPICardProps {
  index: number;
  title: string;
  icon: React.ReactNode;
  value: string;
}

const KpiCard: React.FC<KPICardProps> = ({ index, title, icon, value }) => {
  return (
    <Card
      style={{ backgroundColor: colors[index][0] }}
      className="relative text-white overflow-hidden"
    >
      <div
        style={{ backgroundColor: colors[index][1] }}
        className="absolute -top-16 -right-2 w-36 aspect-square rounded-full"
      />
      <div
        style={{ backgroundColor: colors[index][2] }}
        className="absolute -top-16 -right-16 w-40 aspect-square rounded-full"
      />

      <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        <div className="h-6 w-6">{icon}</div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};

export default KpiCard;
