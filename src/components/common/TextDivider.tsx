import * as React from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface TextDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const TextDivider = ({ children, className, ...props }: TextDividerProps) => {
  return (
    <div className={cn("flex items-center my-4", className)} {...props}>
      <Separator className="flex-1" />
      <span className="px-2 text-sm text-gray-500 dark:text-gray-400">{children}</span>
      <Separator className="flex-1" />
    </div>
  );
};

export default TextDivider;