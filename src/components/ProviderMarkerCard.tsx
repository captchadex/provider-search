import { Coordinates, Provider } from "@/types";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getInitials } from "@/lib/utils";
import {
  IdCardIcon,
  SewingPinFilledIcon,
  StarFilledIcon,
} from "@radix-ui/react-icons";
import { convertDistance, getDistance } from "geolib";
import { Button } from "./ui/button";
import { ProviderSheet } from "./ProviderSheet";

interface ProviderMarkerCardProps {
  provider: Provider;
  geolocation: Coordinates;
}

export function ProviderMarkerCard({
  provider,
  geolocation,
}: ProviderMarkerCardProps) {
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col">
      <Avatar className="w-[100px] h-[100px]">
        <AvatarImage src={provider.photo} />
        <AvatarFallback>{getInitials(provider.name)}</AvatarFallback>
      </Avatar>
      <h2 className="scroll-m-20 text-xl font-semibold tracking-tight first:mt-0">
        {provider.name}, {provider.credentials}
      </h2>
      <p>{provider.specialty}</p>
      <p>Next appointment: {provider.availability.daysToAppointment} days</p>
      <p className="flex items-center text-gray-700 text-sm">
        <StarFilledIcon className="mr-1 text-yellow-400" />
        <span>
          {provider.rating} • {provider.reviewCount} reviews
        </span>
      </p>
      <p className="flex items-center text-gray-700 text-sm">
        <SewingPinFilledIcon className="mr-1 text-red-500" />
        <span>
          {convertDistance(
            getDistance(geolocation, {
              latitude: provider.location.coordinates.lat,
              longitude: provider.location.coordinates.lng,
            }),
            "mi"
          ).toFixed(1)}{" "}
          mi
        </span>
      </p>
      <p className="text-gray-700 text-sm">
        {provider.location.address}, {provider.location.city},{" "}
        {provider.location.state} {provider.location.zipCode}
      </p>
      <p className="flex items-center text-gray-700 text-sm">
        <IdCardIcon className="mr-1 text-green-500" />
        {provider.insuranceAccepted.join(", ")}
      </p>
      <Button
        variant="outline"
        className="my-4 cursor-pointer"
        onClick={() => setIsSheetOpen(true)}
      >
        More details
      </Button>
      <ProviderSheet
        isOpen={isSheetOpen}
        setIsOpen={setIsSheetOpen}
        provider={provider}
      />
    </div>
  );
}
