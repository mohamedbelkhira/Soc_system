import { ReactNode } from "react";

export default function TwoColumns({ children }: { children: ReactNode }) {
  return <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">{children}</div>;
}
