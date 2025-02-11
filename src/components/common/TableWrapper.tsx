import React from "react";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

import { useSidebar } from "../ui/sidebar";

interface TableWrapperProps {
  children: React.ReactNode;
}

export default function TableWrapper({ children }: TableWrapperProps) {
  const isMobile = useIsMobile();
  const sidebar = useSidebar();
  const maxWith = isMobile
    ? window.innerWidth - 2 * 16 - 2 * 20
    : sidebar.open
      ? window.innerWidth - 2 * 24 - 2 * 24 - 288
      : window.innerWidth - 2 * 24 - 2 * 24 - 64;

  return (
    <div className="overflow-auto">
      <ScrollArea
        className="max-w-full whitespace-nowrap rounded-md border"
        style={{ maxWidth: maxWith }}
      >
        {children}
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
