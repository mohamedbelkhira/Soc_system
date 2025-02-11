import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Control } from "react-hook-form";

export default function PreSelectField({
  control,
  name,
  label,
  placeholder,
  options,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  name: string;
  label: string;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Find the matching option for the current field value
        const selectedOption = options.find(option => option.value === field.value);

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <Select 
                onValueChange={(value) => {
                    field.onChange(value);
                }}
                value={field.value || ""}
                >
                <FormControl>
                    <SelectTrigger>
                    <SelectValue placeholder={placeholder}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </SelectValue>
                    </SelectTrigger>
                </FormControl>
                <SelectContent>
                    {options.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                        {item.label}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
