import React from "react";
import clsx from "clsx";
import { Check, X, Clock } from "lucide-react";
import { ExpenseStatus } from "@/types/expense.dto";

interface ExpenseStatusTagProps {
  status: ExpenseStatus;
}

const getStatusDetails = (status: ExpenseStatus) => {
  switch (status) {
    case ExpenseStatus.PENDING:
      return {
        icon: <Clock size={20} />,
        text: "En attente",
        className: "text-blue-600 bg-blue-100",
      };
    case ExpenseStatus.PAID:
      return {
        icon: <Check size={20} />,
        text: "Payé",
        className: "text-green-600 bg-green-100",
      };
    case ExpenseStatus.CANCELED:
      return {
        icon: <X size={20} />,
        text: "Annulé",
        className: "text-red-600 bg-red-100",
      };
    default:
      return {
        icon: <Clock size={20} />,
        text: status,
        className: "text-gray-600 bg-gray-100",
      };
  }
};

const ExpenseStatusTag: React.FC<ExpenseStatusTagProps> = ({ status }) => {
  const statusDetails = getStatusDetails(status);

  return (
    <div
      className={clsx(
        "font-semibold w-fit min-w-32 flex items-center justify-center gap-2 px-4 py-2 rounded-full",
        statusDetails.className
      )}
      role="status"
      aria-label={statusDetails.text}
    >
      {statusDetails.icon}
      <span className="sr-only">{statusDetails.text}</span>
      {statusDetails.text}
    </div>
  );
};

export default ExpenseStatusTag;