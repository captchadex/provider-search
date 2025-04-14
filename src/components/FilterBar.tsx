import { useEffect, useState, Dispatch, SetStateAction } from "react";
import Fuse from "fuse.js";
import { Cross1Icon } from "@radix-ui/react-icons";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Coordinates, SelectableItem } from "@/types";
import { FilterBox } from "./FilterBox";

interface FilterBarProps {
  setLocationSearch: Dispatch<SetStateAction<string[]>>;
  zipCodes: string[];
  selectedSpecialty: SelectableItem;
  setSelectedSpecialty: Dispatch<SetStateAction<SelectableItem>>;
  selectedInsurance: SelectableItem;
  setSelectedInsurance: Dispatch<SetStateAction<SelectableItem>>;
  asap: boolean;
  setAsap: Dispatch<SetStateAction<boolean>>;
  setCurrentLocation: Dispatch<SetStateAction<Coordinates>>;
}

export function FilterBar({
  setLocationSearch,
  zipCodes,
  selectedSpecialty,
  setSelectedSpecialty,
  selectedInsurance,
  setSelectedInsurance,
  asap,
  setAsap,
  setCurrentLocation,
}: FilterBarProps) {
  const [specialties, setSpecialties] = useState<
    { id: number; type: string }[]
  >([]);
  const [insurances, setInsurances] = useState<{ id: number; name: string }[]>(
    []
  );
  const [locations, setLocations] = useState<{ id: number; name: string }[]>(
    []
  );

  const parsedSpecialties = specialties.map((specialty) => ({
    value: specialty.type,
    label: specialty.type,
  }));
  const parsedInsurances = insurances.map((insurance) => ({
    value: insurance.name,
    label: insurance.name,
  }));
  const parsedLocations = [
    ...locations.map((location) => location.name),
    ...zipCodes,
  ];

  useEffect(() => {
    const fetchSpecialties = async () => {
      const response = await fetch("http://localhost:3000/specialties");
      const data = await response.json();
      setSpecialties(data);
    };

    const fetchInsurances = async () => {
      const response = await fetch("http://localhost:3000/insurances");
      const data = await response.json();
      setInsurances(data);
    };

    const fetchLocations = async () => {
      const response = await fetch("http://localhost:3000/locations");
      const data = await response.json();
      setLocations(data);
    };

    fetchSpecialties();
    fetchInsurances();
    fetchLocations();
  }, []);

  const fuse = new Fuse(parsedLocations, {
    includeScore: true,
    threshold: 0.2,
  });

  return (
    <div className="flex items-center flex-col md:flex-row gap-4">
      <Input
        className="lg:w-[250px]"
        placeholder="Type a city or ZIP code..."
        onChange={async (e) => {
          if (e.target.value === "") {
            setLocationSearch([]);
            return;
          }

          const result = fuse.search(e.target.value);

          // If there is a perfect match
          if (result[0].score === 0) {
            setLocationSearch([result[0].item]);
            return;
          }

          const items = result.map((item) => item.item);
          setLocationSearch(items);

          // Map our search input to an actual google maps location to get coordinates for the map view
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${
              result[0].item
            }&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
          );
          const data = await response.json();
          setCurrentLocation({
            latitude: data.results[0].geometry.location.lat,
            longitude: data.results[0].geometry.location.lng,
          });
        }}
      />
      <FilterBox
        label="Specialty"
        inputPlaceholder={"Select a specialty..."}
        selected={selectedSpecialty}
        setSelected={setSelectedSpecialty}
        items={parsedSpecialties}
      />
      <FilterBox
        label="Insurance"
        inputPlaceholder={"Select an insurance plan..."}
        selected={selectedInsurance}
        setSelected={setSelectedInsurance}
        items={parsedInsurances}
      />
      <div className="flex space-x-2">
        <Checkbox
          id="filterByAvailability"
          checked={asap}
          onCheckedChange={(checked) => setAsap(!!checked)}
        />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="filterByAvailability"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            ASAP
          </label>
        </div>
      </div>
      <Button
        className="cursor-pointer hover:opacity-90 active:opacity-70"
        onClick={() => {
          setSelectedSpecialty(null);
          setSelectedInsurance(null);
          setAsap(false);
          setLocationSearch([]);
        }}
      >
        <Cross1Icon /> Clear filters
      </Button>
    </div>
  );
}
