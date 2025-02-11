import clsx from "clsx";
import { Check, X, Clock } from "lucide-react";

const getStatusDetails = (state: string) => {
  switch (state) {
    case "ORDERED":
      return {
        icon: <Clock size={20} />,
        text: "Commandé",
        className: "text-blue-600 bg-blue-100"
      };
    case "RECEIVED":
      return {
        icon: <Check size={20} />,
        text: "Reçu",
        className: "text-green-600 bg-green-100"
      };
    case "CANCELED":
      return {
        icon: <X size={20} />,
        text: "Annulé",
        className: "text-red-600 bg-red-100"
      };
    default:
      return {
        icon: <Clock size={20} />,
        text: state,
        className: "text-gray-600 bg-gray-100"
      };
  }
};

export default function PurchaseStatusTag({ state }: { state: string }) {
  const statusDetails = getStatusDetails(state);
  
  return (
    <div
      className={clsx(
        "font-semibold w-fit min-w-32 flex items-center justify-center gap-2 px-4 py-2 rounded-full",
        statusDetails.className
      )}
    >
      {statusDetails.icon}
      {statusDetails.text}
    </div>
  );
}