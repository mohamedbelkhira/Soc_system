import { useState, useRef, useEffect } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { TagResponse } from '@/dto/tag.dto';
import { useTags } from '@/swr/tags.swr';

interface TagsMultiSelectProps {
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    className?: string;
}

export default function TagsMultiSelect({
    value = [],
    onChange,
    placeholder = 'Sélectionner des tags...',
    className,
}: TagsMultiSelectProps) {
    const [open, setOpen] = useState(false);
    const { tags, isLoading } = useTags();
    const triggerRef = useRef<HTMLButtonElement>(null);

    // Get selected tag objects
    const selectedTags = tags.filter((tag) => value.includes(tag.tagId));

    const handleSelect = (tagId: string) => {
        if (value.includes(tagId)) {
            onChange(value.filter((id) => id !== tagId));
        } else {
            onChange([...value, tagId]);
        }
    };

    const handleRemove = (tagId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(value.filter((id) => id !== tagId));
    };

    const handleClearAll = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange([]);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    ref={triggerRef}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        'w-full justify-between min-h-10 h-auto',
                        'hover:bg-accent/50 transition-all duration-200',
                        selectedTags.length > 0 ? 'py-2' : '',
                        className
                    )}
                >
                    <div className="flex flex-wrap gap-1 flex-1">
                        {selectedTags.length === 0 ? (
                            <span className="text-muted-foreground">{placeholder}</span>
                        ) : (
                            selectedTags.map((tag) => (
                                <Badge
                                    key={tag.tagId}
                                    variant="secondary"
                                    style={{
                                        backgroundColor: tag.color ? `${tag.color}20` : undefined,
                                        color: tag.color || undefined,
                                        borderColor: tag.color ? `${tag.color}40` : undefined,
                                    }}
                                    className="border text-xs px-2 py-0.5 flex items-center gap-1"
                                >
                                    {tag.name}
                                    <button
                                        type="button"
                                        onClick={(e) => handleRemove(tag.tagId, e)}
                                        className="ml-1 hover:bg-foreground/10 rounded-full p-0.5 transition-colors"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))
                        )}
                    </div>
                    <div className="flex items-center gap-1 ml-2 shrink-0">
                        {selectedTags.length > 0 && (
                            <button
                                type="button"
                                onClick={handleClearAll}
                                className="p-1 hover:bg-muted rounded transition-colors"
                            >
                                <X className="h-4 w-4 text-muted-foreground" />
                            </button>
                        )}
                        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-full min-w-[300px] p-0"
                align="start"
                style={{ width: triggerRef.current?.offsetWidth }}
            >
                <Command>
                    <CommandInput placeholder="Rechercher un tag..." />
                    <CommandList>
                        <CommandEmpty>
                            {isLoading ? 'Chargement...' : 'Aucun tag trouvé.'}
                        </CommandEmpty>
                        <CommandGroup>
                            {tags.map((tag) => {
                                const isSelected = value.includes(tag.tagId);
                                return (
                                    <CommandItem
                                        key={tag.tagId}
                                        value={tag.name}
                                        onSelect={() => handleSelect(tag.tagId)}
                                        className="cursor-pointer"
                                    >
                                        <div className="flex items-center gap-2 flex-1">
                                            <div
                                                className="h-3 w-3 rounded-full border border-border"
                                                style={{ backgroundColor: tag.color || '#6B7280' }}
                                            />
                                            <span>{tag.name}</span>
                                        </div>
                                        <Check
                                            className={cn(
                                                'h-4 w-4 transition-opacity',
                                                isSelected ? 'opacity-100' : 'opacity-0'
                                            )}
                                        />
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
