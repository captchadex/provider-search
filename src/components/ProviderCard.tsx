import { convertDistance, getDistance } from "geolib";
import {
  StarFilledIcon,
  SewingPinFilledIcon,
  IdCardIcon,
} from "@radix-ui/react-icons";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Coordinates, Provider } from "@/types";
import { getInitials } from "@/lib/utils";
import { ProviderSheet } from "./ProviderSheet";
import { useState } from "react";

interface ProviderCardProps {
  provider: Provider;
  geolocation: Coordinates;
}

export function ProviderCard({ provider, geolocation }: ProviderCardProps) {
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);

  return (
    <>
      <div
        className={`p-4 flex hover:bg-gray-100 cursor-pointer`}
        onClick={() => {
          setIsSheetOpen(true);
        }}
      >
        <Avatar className="w-[100px] h-[100px] mr-4">
          <AvatarImage src={provider.photo} />
          <AvatarFallback>{getInitials(provider.name)}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="scroll-m-20 text-xl font-semibold tracking-tight first:mt-0">
            {provider.name}, {provider.credentials}
          </h2>
          <p>{provider.specialty}</p>
          <p>
            Next appointment: {provider.availability.daysToAppointment} days
          </p>
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
              mi • {provider.location.address}, {provider.location.city},{" "}
              {provider.location.state} {provider.location.zipCode}
            </span>
          </p>
          <p className="flex items-center text-gray-700 text-sm">
            <IdCardIcon className="mr-1 text-green-500" />
            {provider.insuranceAccepted.join(", ")}
          </p>
        </div>
      </div>
      <ProviderSheet
        isOpen={isSheetOpen}
        setIsOpen={setIsSheetOpen}
        provider={provider}
      />
    </>
  );
}
