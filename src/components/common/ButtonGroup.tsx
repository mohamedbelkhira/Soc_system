import React, { ReactNode } from "react";

export default function ButtonGroup({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-end space-x-1 md:space-x-2">{children}</div>
  );
}
