import { ColorScheme } from "./InformationCard";

const schemeStyles = {
  success: "bg-[#00897B30] border-green-200 text-[#00695C]",
  warning: "bg-yellow-100 border-yellow-200 text-yellow-900",
  danger: "bg-[#F4511E30] border-red-200 text-[#D84315]",
};

export default function SaleStatusTag({
  label,
  icon: Icon,
  scheme,
}: {
  icon: React.ElementType;
  label: string;
  scheme: ColorScheme;
}) {
  const baseClasses =
    "font-semibold w-fit min-w-32 flex items-center justify-center gap-2 px-4 py-2 rounded-full";
  const colorClasses = schemeStyles[scheme];
  return (
    <div className={`${baseClasses} ${colorClasses}`}>
      <Icon
        className={`h-5 w-5 ${
          scheme ? `text-${scheme === "warning" ? "yellow" : scheme}-600` : ""
        }`}
      />{" "}
      {label}
    </div>
  );
}
