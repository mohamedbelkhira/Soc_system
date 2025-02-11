import { toast } from "sonner";

type ToastStatus = "success" | "error" | "info" | "warning";

export const showToast = (status: ToastStatus, message?: string) => {
  switch (status) {
    case "success":
      toast.success(message, {
        className: "p-3 bg-green-600 text-white",
        duration: 3000,
      });
      break;
    case "error":
      toast.error(message, {
        className: "p-3 bg-red-500 text-white",
        duration: 4000,
      });
      break;
    case "info":
      toast.info(message, {
        className: "p-3 bg-blue-500 text-white",
        duration: 3000,
      });
      break;
    case "warning":
      toast.warning(message, {
        className: "p-3 bg-yellow-500 text-white",
        duration: 3500,
      });
      break;
  }
};

export default showToast;
