import React from "react";
import { Control } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, X } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface ComboboxFormFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  name: string;
  label: string;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  emptyMessage?: string;
}

const MultiSelectField = ({
  control,
  name,
  label,
  options,
  disabled = false,
  placeholder = "Select options...",
  emptyMessage = "No item found",
}: ComboboxFormFieldProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                  disabled={disabled}
                >
                  <div className="flex gap-1 flex-wrap">
                    {field.value && field.value.length > 0 ? (
                      field.value.map((value: string) => (
                        <Badge
                          key={value}
                          variant="secondary"
                          className="mr-1 mb-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            field.onChange(
                              field.value.filter((v: string) => v !== value)
                            );
                          }}
                        >
                          {
                            options.find((option) => option.value === value)
                              ?.label
                          }
                          <X className="ml-1 h-3 w-3" />
                        </Badge>
                      ))
                    ) : (
                      <span className="font-normal">{placeholder}</span>
                    )}
                  </div>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command>
                  <CommandInput
                    placeholder={`Chercher des ${label.toLowerCase()}...`}
                    className="h-10"
                  />
                  <CommandList>
                    <CommandEmpty>{emptyMessage}</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-y-auto">
                      {options.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.label} // Keep label for search functionality
                          onSelect={() => {
                            const values = field.value || [];
                            const newValues = values.includes(option.value)
                              ? values.filter((v: string) => v !== option.value)
                              : [...values, option.value];
                            field.onChange(newValues);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value?.includes(option.value)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default MultiSelectField;
