import { useEffect, useState } from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ComboboxProps<T> {
  items: T[];
  getValue: (item: T | string | undefined) => string | undefined;
  getLabel: (item: T) => string;
  getRealValue: (item: T) => T;
  itemName: string;
  onSelection?: (value: T) => void;
  initialValue?: T | undefined;
  originalValue?: string;
}

export function Combobox<T>({
  items,
  getValue,
  getLabel,
  getRealValue,
  itemName,
  onSelection,
  originalValue,
  initialValue = undefined,
}: ComboboxProps<T>) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | undefined>(
    getValue(initialValue)
  );

  const handleLabel = () => {
    const found = items.find((item) => getValue(item) === value);
    if (found) {
      return getLabel(found);
    }
    return null;
  };

  useEffect(() => {
    if (originalValue) {
      setValue(originalValue);
    }
  }, [originalValue]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <span className="w-10/12 whitespace-normal">
            {value ? handleLabel() : `Seleccionar ${itemName}`}
          </span>
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <Command className="sm:max-h-32 md:max-h-48 lg:max-h-64">
          <CommandInput placeholder={`Buscar ${itemName}...`} className="h-9" />
          <CommandList>
            <CommandEmpty>No encontrado</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={getValue(item)}
                  value={getValue(item)}
                  onSelect={(currentValue) => {
                    setValue(currentValue);
                    setOpen(false);
                    if (onSelection) {
                      onSelection(getRealValue(item));
                    }
                  }}
                >
                  {getLabel(item)}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      getValue(value) === getValue(item)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
