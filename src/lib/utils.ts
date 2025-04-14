import { Provider, SelectableItem } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string) {
  const names = name.split(" ");
  return names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase();
}

export function filterProviders(
  locationSearchInput: string,
  locationSearch: string[],
  selectedSpecialty: SelectableItem,
  selectedInsurance: SelectableItem
) {
  return (provider: Provider) => {
    const matchesLocation =
      locationSearchInput.length > 0
        ? locationSearch.includes(provider.location.zipCode) ||
          locationSearch.includes(
            `${provider.location.city}, ${provider.location.state}`
          )
        : true;

    console.log(locationSearchInput);

    const matchesSpecialty = selectedSpecialty
      ? provider.specialty === selectedSpecialty.value
      : true;

    const matchesInsurance = selectedInsurance
      ? provider.insuranceAccepted.includes(selectedInsurance.value)
      : true;

    return matchesLocation && matchesSpecialty && matchesInsurance;
  };
}
