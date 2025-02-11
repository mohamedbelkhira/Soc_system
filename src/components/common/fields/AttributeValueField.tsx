import { Control } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AttributeType } from "@/schemas/attribute.schema";

export default function AttributeValueField({
  control,
  type,
  name,
  label,
  placeholder,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  type: AttributeType;
  name: string;
  label: string;
  placeholder: string;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              defaultValue={
                type === AttributeType.NUMBER
                  ? Number(field.value)
                  : field.value
              }
              placeholder={placeholder}
              {...field}
              type={type === AttributeType.NUMBER ? "number" : "text"}
              onChange={(e) =>
                field.onChange(
                  type === AttributeType.NUMBER
                    ? Number(e.target.value)
                    : e.target.value
                )
              }
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
