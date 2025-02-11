import { AttributeTypeSwitch } from "@/components/common/AttributeTypeSwitch";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Control } from "react-hook-form";

export default function AttributeTypeField({
  control,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
}) {
  return (
    <FormField
      control={control}
      name="type"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg">
          <div className="space-y-0.5">
            <FormLabel>Type d'attribut</FormLabel>
            <FormMessage />
          </div>
          <FormControl>
            <AttributeTypeSwitch
              value={field.value}
              onChange={field.onChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
