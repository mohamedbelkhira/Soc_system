import * as React from "react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

interface DateRangeFilterProps {
  onChange: (range: DateRange | undefined) => void;
  value?: DateRange;
}

export function DateRangeFilter({ onChange, value }: DateRangeFilterProps) {
  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[300px] justify-start text-left"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "dd MMM yyyy", { locale: fr })} -{" "}
                  {format(value.to, "dd MMM yyyy", { locale: fr })}
                </>
              ) : (
                format(value.from, "dd MMM yyyy", { locale: fr })
              )
            ) : (
              <span className="text-muted-foreground">
                Sélectionner une période
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={value}
            onSelect={onChange}
            numberOfMonths={1}
            locale={fr}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default DateRangeFilter;
