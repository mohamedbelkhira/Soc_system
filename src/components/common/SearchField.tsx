import React from "react";

import { Search } from "lucide-react";

import { Input } from "../ui/input";

export default function SearchField({
  onChange,
  placeholder,
}: {
  onChange: (query: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <Input
        placeholder={placeholder}
        onChange={(event) => {
          onChange(event.target.value);
        }}
      />
      <Search />
    </div>
  );
}
