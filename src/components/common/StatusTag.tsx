import clsx from "clsx";
import { Check, X } from "lucide-react";

export default function StatusTag({ isActive }: { isActive: boolean }) {
  return (
    <div
      className={clsx(
        "mx-auto font-semibold w-fit min-w-32 flex items-center justify-center gap-2 px-4 py-2 rounded-full text-[#00695C] bg-[#00897B30]",
        {
          "text-[#F4511E] bg-[#f4511e30]": !isActive,
        }
      )}
    >
      {isActive ? <Check size={20} /> : <X size={20} />}
      {isActive ? "Active" : "Inactive"}
    </div>
  );
}
