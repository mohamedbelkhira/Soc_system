import { useState } from "react";
import { Control } from "react-hook-form";

import { Button } from "@/components/ui/button";
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
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SelectField({
  control,
  name,
  label,
  placeholder,
  options,
  disabled = false,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  name: string;
  label: string;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
  disabled?: boolean;
}) {
  const [key, setKey] = useState(+new Date());

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedOption = options.find(
          (option) => option.value === field.value
        );

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <Select
              key={key}
              onValueChange={field.onChange}
              value={field.value}
              disabled={disabled}
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
                <SelectSeparator />
                <Button
                  className="w-full px-2"
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setKey(+new Date());
                    field.onChange(null);
                  }}
                >
                  Réinitialiser
                </Button>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
