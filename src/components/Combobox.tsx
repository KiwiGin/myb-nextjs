import { useState } from "react";
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
}

export function Combobox<T>({
  items,
  getValue,
  getLabel,
  getRealValue,
  itemName,
  onSelection,
  initialValue = undefined,
}: ComboboxProps<T>) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<T | string | undefined>(initialValue);

  const handleLabel = () => {
    const found = items.find((item) => getLabel(item) === value);
    if (found) {
      return getLabel(found);
    }
    return null;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value ? handleLabel() : `Seleccionar ${itemName}`}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Buscar ${itemName}...`} className="h-9" />
          <div className="overflow-auto sm:max-h-32 md:max-h-48 lg:max-h-64">
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
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
