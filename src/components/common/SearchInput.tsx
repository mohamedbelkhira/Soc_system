import { Search } from "lucide-react";

import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function SearchInput({
  value,
  onChange,
  label = "Chercher par...",
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}) {
  return (
    <div className="w-full space-y-1">
      <Label>{label}</Label>
      <div className="w-full relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder || "Rechercher par nom..."}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-8"
        />
      </div>
    </div>
  );
}
