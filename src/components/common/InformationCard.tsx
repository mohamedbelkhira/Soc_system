import React from "react";

export type ColorScheme = "success" | "warning" | "danger";

interface InformationCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  secondaryValue?: string;  // Optional secondary value
  scheme?: ColorScheme;
}

const schemeStyles = {
  success: "bg-green-100 border-green-200 text-green-900",
  warning: "bg-yellow-100 border-yellow-200 text-yellow-900",
  danger: "bg-red-100 border-red-200 text-red-900",
};

export default function InformationCard({
  icon: Icon,
  label,
  value,
  secondaryValue,
  scheme,
}: InformationCardProps) {
  const baseClasses = "px-4 py-3.5 flex justify-between rounded-md border";
  const colorClasses = scheme ? schemeStyles[scheme] : "bg-muted";

  return (
    <div className={`${baseClasses} ${colorClasses}`}>
      <div className="flex items-center gap-4">
        <Icon
          className={`h-5 w-5 ${
            scheme ? `text-${scheme === "warning" ? "yellow" : scheme}-600` : ""
          }`}
        />
        <span className="text-sm md:text-base font-medium">{label}</span>
      </div>
      <span className="text-sm md:text-base">
        {value}
        {secondaryValue && ` | ${secondaryValue}`}
      </span>
    </div>
  );
}