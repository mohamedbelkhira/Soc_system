// src/components/TextareaSection.tsx
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TextareaSectionProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const TextareaSection: React.FC<TextareaSectionProps> = ({ 
  label, 
  name, 
  value, 
  onChange 
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="font-bold">{label}</Label>
      <Textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="min-h-24"
      />
    </div>
  );
};


