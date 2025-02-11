import React, { useState } from "react";
import { Control } from "react-hook-form";
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
import { Check, ChevronsUpDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  name: string;
  label: string;
  placeholder: string;
  options: Option[];
  disabled?: boolean;
  emptyMessage?: string;
}

const SearchableSelectField = ({
  control,
  name,
  label,
  placeholder,
  options,
  disabled = false,
  emptyMessage = "No item found",
}: SearchableSelectFieldProps) => {
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState(+new Date());

  return (
    <FormField
      key={key}
      control={control}
      name={name}
      render={({ field }) => {
        const selectedOption = options.find(
          (option) => option.value === field.value
        );

        return (
          <FormItem className="flex flex-col">
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full h-10 justify-between"
                    disabled={disabled}
                  >
                    {selectedOption ? (
                      selectedOption.label
                    ) : (
                      <span className="text-muted-foreground">{placeholder}</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput
                      placeholder={`Search ${label.toLowerCase()}...`}
                      className="h-10"
                    />
                    <CommandList>
                      <CommandEmpty>{emptyMessage}</CommandEmpty>
                      <CommandGroup className="max-h-64 overflow-y-auto">
                        {options.map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.label}
                            onSelect={() => {
                              field.onChange(option.value);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value === option.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {option.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                      <Button
                        className="w-full px-2 my-2"
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setKey(+new Date());
                          field.onChange(null);
                          setOpen(false);
                        }}
                      >
                        Réinitialiser
                      </Button>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default SearchableSelectField;