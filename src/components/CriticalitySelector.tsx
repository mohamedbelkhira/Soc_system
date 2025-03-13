import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface CriticalitySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const CriticalitySelector: React.FC<CriticalitySelectorProps> = ({
  value,
  onChange
}) => {
  return (
    <div className="space-y-2">
      <Label>Criticité de l'événement :</Label>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="flex space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Critique" id="critique" />
          <Label htmlFor="critique" className="text-red-600 font-bold">Critique</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Haut" id="haut" />
          <Label htmlFor="haut" className="text-orange-500 font-bold">Haut</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Moyen" id="moyen" />
          <Label htmlFor="moyen" className="text-yellow-500 font-bold">Moyen</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Faible" id="faible" />
          <Label htmlFor="faible" className="text-green-600 font-bold">Faible</Label>
        </div>
      </RadioGroup>
    </div>
  );
};