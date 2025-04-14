import { useMediaQuery } from "@/hooks/use-media-query";
import { SelectableItem } from "@/types";
import { Dispatch, SetStateAction, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { TriangleDownIcon } from "@radix-ui/react-icons";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { FilterList } from "./FilterList";

export function FilterBox({
  label,
  inputPlaceholder,
  selected,
  setSelected,
  items,
}: {
  label: string;
  inputPlaceholder: string;
  selected: SelectableItem;
  setSelected: Dispatch<SetStateAction<SelectableItem>>;
  items: SelectableItem[];
}) {
  const [open, setOpen] = useState<boolean>(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start cursor-pointer">
            <TriangleDownIcon />
            {selected?.label ?? label}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <FilterList
            placeholder={inputPlaceholder}
            setOpen={setOpen}
            setSelected={setSelected}
            items={items}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="justify-start cursor-pointer">
          <TriangleDownIcon />
          {selected?.label ?? label}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerTitle className="sr-only">{label}</DrawerTitle>
        <DrawerDescription className="sr-only">
          Select a {label} to filter the results.
        </DrawerDescription>
        <div className="mt-4 border-t">
          <FilterList
            placeholder={inputPlaceholder}
            setOpen={setOpen}
            setSelected={setSelected}
            items={items}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
