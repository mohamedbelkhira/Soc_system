// DateField.tsx
import React from "react";
import { Control } from "react-hook-form";

import { DatePicker } from "@/components/common/DatePicker";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface DateFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  name: string;
  label: string;
}

const NewDateField: React.FC<DateFieldProps> = ({ control, name, label }) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selectedDate = field.value ? new Date(field.value) : undefined;

        const handleDateChange = (date: Date | undefined) => {
          field.onChange(date);
        };

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <DatePicker
                value={selectedDate}
                onChange={handleDateChange}
                error={fieldState.error?.message}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default NewDateField;
