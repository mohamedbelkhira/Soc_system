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
  import { Control, FieldValues, Path } from "react-hook-form";
  
  type SelectFieldProps<T extends FieldValues> = {
    control: Control<T>;
    name: Path<T>;
    label: string;
    placeholder: string;
    options: Array<{ value: string; label: string }>;
    onSelectChange?: (value: string) => void;
  };
  
  export default function GenericSelectField<T extends FieldValues>({
    control,
    name,
    label,
    placeholder,
    options,
    onSelectChange,
  }: SelectFieldProps<T>) {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                onSelectChange?.(value);
              }}
              // Use value instead of defaultValue
              value={field.value as string || ""}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
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
        )}
      />
    );
  }
  