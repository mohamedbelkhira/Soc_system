// DateField.tsx
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useController, useFormContext } from "react-hook-form";
import { DatePicker } from "@/components/common/DatePicker";

interface DateFieldProps {
  name: keyof any; // Adjust the type based on your form's structure
  label: string;
}

const DateField: React.FC<DateFieldProps> = ({ name, label }) => {
  const { control } = useFormContext();

  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: undefined,
  });

  // Convert the stored value (Date or undefined) to a Date object for DatePicker
  const selectedDate = value ? new Date(value) : undefined;

  const handleDateChange = (date: Date | undefined) => {
    // Convert Date object to ISO string or undefined
    const isoDate = date ? date.toISOString() : undefined;
    onChange(isoDate);
  };

  return (
    <FormField
      control={control}
      
      name={name}
      render={() => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <DatePicker
              value={selectedDate}
              onChange={handleDateChange}
              // Assuming DatePicker accepts an error prop to display errors
              error={error?.message}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DateField;
