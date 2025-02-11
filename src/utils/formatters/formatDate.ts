import { format } from "date-fns";

export function formatDate(date: Date | string, dateFormat: string = "MMM d, yyyy"): string {
  return format(new Date(date), dateFormat);
}