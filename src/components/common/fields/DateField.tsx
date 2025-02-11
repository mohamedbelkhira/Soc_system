  // DateField.tsx
  import React from "react";
  import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
  import { Control } from "react-hook-form";
  import { DatePicker } from "@/components/common/DatePicker";

  interface DateFieldProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: Control<any>;
    name: string;
    label: string;
  }

  const DateField: React.FC<DateFieldProps> = ({ control, name, label }) => {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field, fieldState }) => {
          // Convert the stored string value back to a Date object for the DatePicker
          const selectedDate = field.value ? new Date(field.value) : undefined;

          // Handle the date change event
          const handleDateChange = (date: Date | undefined) => {
            // Convert the Date object to an ISO string or set it to null
            const value = date ? date.toISOString() : null;
            field.onChange(value);
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

  export default DateField;
