import { Dispatch, SetStateAction } from "react";
import {
  APIProvider,
  Map as GMap,
  MapCameraChangedEvent,
} from "@vis.gl/react-google-maps";

import { Marker } from "./Marker";
import { ProviderMarkerCard } from "./ProviderMarkerCard";
import { Coordinates, Provider } from "@/types";

interface MapProps {
  isMapVisible: boolean;
  currentLocation: Coordinates;
  setCurrentLocation: Dispatch<SetStateAction<Coordinates>>;
  geolocation: Coordinates;
  providers: Provider[];
}

export function Map({
  isMapVisible,
  currentLocation,
  setCurrentLocation,
  geolocation,
  providers,
}: MapProps) {
  const handleCameraChange = (ev: MapCameraChangedEvent) =>
    setCurrentLocation({
      latitude: ev.detail.center.lat,
      longitude: ev.detail.center.lng,
    });

  return (
    <APIProvider
      apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={["marker"]}
    >
      <GMap
        defaultZoom={14}
        center={{
          lat: currentLocation.latitude,
          lng: currentLocation.longitude,
        }}
        onCameraChanged={handleCameraChange}
        mapId="provider-search"
        className={`transition-all duration-200 absolute top-0 left-0 w-[100vw] h-[100vh] ${
          isMapVisible ? "visible opacity-100" : "invisible opacity-0"
        }`}
        gestureHandling={"greedy"}
      >
        {providers.map((provider) => (
          <Marker
            key={provider.id}
            content={
              <ProviderMarkerCard
                provider={provider}
                geolocation={geolocation}
              />
            }
            provider={provider}
          />
        ))}
      </GMap>
    </APIProvider>
  );
}
