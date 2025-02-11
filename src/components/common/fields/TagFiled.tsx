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
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface TagFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  type: "STRING" | "NUMBER";
  name: string;
  label: string;
  placeholder: string;
  onValuesChange?: (values: string[]) => void;
}

export default function TagFiled({
  control,
  type = "STRING",
  name,
  label,
  placeholder,
  onValuesChange,
}: TagFieldProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    onChange: (value: string[]) => void
  ) => {
    if (event.key === "," || event.key === "Enter") {
      event.preventDefault();
      const value = inputValue.trim();
      if (value && !tags.includes(value)) {
        const newTags = [...tags, value];
        setTags(newTags);
        onChange(newTags);
        onValuesChange?.(newTags);
        setInputValue("");
      }
    } else if (event.key === "Backspace" && !inputValue && tags.length > 0) {
      const newTags = tags.slice(0, -1);
      setTags(newTags);
      onChange(newTags);
      onValuesChange?.(newTags);
    }
  };

  const removeTag = (
    indexToRemove: number,
    onChange: (value: string[]) => void
  ) => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    setTags(newTags);
    onChange(newTags);
    onValuesChange?.(newTags);
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { onChange, ...field } }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="space-y-2">
              <Input
                {...field}
                type={type === "STRING" ? "text" : "number"}
                placeholder={placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, onChange)}
              />
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2 rounded-md border">
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 text-sm bg-muted px-2 py-1 rounded"
                    >
                      <span>{tag}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => removeTag(index, onChange)}
                      >
                        <X className="h-2 w-2" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
