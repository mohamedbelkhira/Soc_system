import { useState, useCallback, useRef, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Palette, Check } from 'lucide-react';

interface ColorPickerProps {
    value?: string;
    onChange: (color: string) => void;
    className?: string;
}

// Predefined color palette for cybersecurity/SOC theme
const PRESET_COLORS = [
    // Reds - Critical/High severity
    '#EF4444', '#DC2626', '#B91C1C', '#F87171',
    // Oranges - Medium severity  
    '#F97316', '#EA580C', '#FB923C', '#FDBA74',
    // Yellows - Low severity
    '#EAB308', '#CA8A04', '#FDE047', '#FEF08A',
    // Greens - Success/Resolved
    '#22C55E', '#16A34A', '#4ADE80', '#86EFAC',
    // Cyans - Info/Network
    '#06B6D4', '#0891B2', '#22D3EE', '#67E8F9',
    // Blues - General
    '#3B82F6', '#2563EB', '#60A5FA', '#93C5FD',
    // Purples - Threats
    '#8B5CF6', '#7C3AED', '#A78BFA', '#C4B5FD',
    // Pinks - Alerts
    '#EC4899', '#DB2777', '#F472B6', '#F9A8D4',
    // Grays - Neutral
    '#6B7280', '#4B5563', '#9CA3AF', '#D1D5DB',
];

export default function ColorPicker({ value = '#22C55E', onChange, className }: ColorPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [customColor, setCustomColor] = useState(value);
    const [selectedColor, setSelectedColor] = useState(value);
    const inputRef = useRef<HTMLInputElement>(null);

    // Sync with external value
    useEffect(() => {
        setSelectedColor(value);
        setCustomColor(value);
    }, [value]);

    const handleColorSelect = useCallback((color: string) => {
        setSelectedColor(color);
        setCustomColor(color);
        onChange(color);
    }, [onChange]);

    const handleCustomColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newColor = e.target.value;
        setCustomColor(newColor);
        if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(newColor)) {
            setSelectedColor(newColor);
            onChange(newColor);
        }
    }, [onChange]);

    const handleNativePickerChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newColor = e.target.value.toUpperCase();
        setCustomColor(newColor);
        setSelectedColor(newColor);
        onChange(newColor);
    }, [onChange]);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    className={cn(
                        'w-full justify-start gap-3 h-10 px-3 font-normal',
                        'hover:bg-accent/50 transition-all duration-200',
                        className
                    )}
                >
                    <div
                        className="h-5 w-5 rounded-md border border-border shadow-sm transition-transform duration-200 hover:scale-110"
                        style={{ backgroundColor: selectedColor }}
                    />
                    <span className="text-muted-foreground font-mono text-sm">{selectedColor}</span>
                    <Palette className="ml-auto h-4 w-4 text-muted-foreground" />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                className="w-72 p-4 bg-popover/95 backdrop-blur-sm border-border shadow-xl"
                align="start"
                sideOffset={8}
            >
                <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">Choisir une couleur</span>
                        <div
                            className="h-8 w-8 rounded-lg border-2 border-border shadow-md transition-all duration-200"
                            style={{ backgroundColor: selectedColor }}
                        />
                    </div>

                    {/* Color Grid */}
                    <div className="grid grid-cols-8 gap-1.5">
                        {PRESET_COLORS.map((color) => (
                            <button
                                key={color}
                                type="button"
                                onClick={() => handleColorSelect(color)}
                                className={cn(
                                    'h-7 w-7 rounded-md border transition-all duration-150',
                                    'hover:scale-110 hover:shadow-lg hover:z-10',
                                    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
                                    selectedColor === color
                                        ? 'border-foreground ring-2 ring-ring scale-110 shadow-lg'
                                        : 'border-transparent hover:border-muted-foreground/30'
                                )}
                                style={{ backgroundColor: color }}
                            >
                                {selectedColor === color && (
                                    <Check
                                        className={cn(
                                            'h-4 w-4 mx-auto',
                                            // Use white or black check based on color brightness
                                            parseInt(color.slice(1), 16) > 0xffffff / 2
                                                ? 'text-gray-800'
                                                : 'text-white'
                                        )}
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-popover px-2 text-xs text-muted-foreground">
                                Couleur personnalisée
                            </span>
                        </div>
                    </div>

                    {/* Custom Color Input */}
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <input
                                ref={inputRef}
                                type="color"
                                value={selectedColor}
                                onChange={handleNativePickerChange}
                                className="h-10 w-10 cursor-pointer rounded-md border border-border p-0.5 bg-transparent"
                            />
                        </div>
                        <Input
                            type="text"
                            value={customColor}
                            onChange={handleCustomColorChange}
                            placeholder="#000000"
                            className="font-mono text-sm h-10 flex-1"
                            maxLength={7}
                        />
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs"
                            onClick={() => handleColorSelect('#22C55E')}
                        >
                            Défaut
                        </Button>
                        <Button
                            type="button"
                            variant="default"
                            size="sm"
                            className="flex-1 text-xs"
                            onClick={() => setIsOpen(false)}
                        >
                            Appliquer
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
