import { SelectableItem } from "@/types";
import { Dispatch, SetStateAction } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";

export function FilterList({
  placeholder,
  setOpen,
  setSelected,
  items,
}: {
  placeholder: string;
  setOpen: (open: boolean) => void;
  setSelected: Dispatch<SetStateAction<SelectableItem>>;
  items: SelectableItem[];
}) {
  return (
    <Command>
      <CommandInput placeholder={placeholder} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          <CommandItem
            key="clear"
            value={undefined}
            onSelect={() => {
              setSelected(null);
              setOpen(false);
            }}
          >
            --- Clear filter ---
          </CommandItem>
          {items.length === 0 && <CommandItem>Loading...</CommandItem>}
          {items.length > 0 &&
            items.map((item) => (
              <CommandItem
                key={item?.value}
                value={item?.value}
                onSelect={(value) => {
                  setSelected({ value: value, label: value });
                  setOpen(false);
                }}
              >
                {item?.label}
              </CommandItem>
            ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
