import * as React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterSelectOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  label?: string; // optional label text
  placeholder?: string; // placeholder to display when value is empty
  options: FilterSelectOption[];
  value: string; // current selected value
  onChange: (v: string) => void; // called whenever user selects a new value
  disabled?: boolean;
}

export default function FilterSelect({
  label,
  placeholder,
  options,
  value,
  onChange,
  disabled = false,
}: FilterSelectProps) {
  return (
    <div className="space-y-1">
      {label && <div className="text-sm font-medium">{label}</div>}
      <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-[265px]  bg-white dark:bg-background">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
