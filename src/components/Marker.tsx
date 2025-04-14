import { useState } from "react";
import {
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { Provider } from "@/types";

interface MarkerProps {
  content: React.ReactNode;
  provider: Provider;
}

export const Marker = ({ content, provider }: MarkerProps) => {
  const [infowindowOpen, setInfowindowOpen] = useState(false);
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        onClick={() => setInfowindowOpen(true)}
        position={{
          lat: provider.location.coordinates.lat,
          lng: provider.location.coordinates.lng,
        }}
        title={`Open ${provider.name}, ${provider.credentials} provider details`}
      />
      {infowindowOpen && (
        <InfoWindow
          anchor={marker}
          maxWidth={200}
          onCloseClick={() => setInfowindowOpen(false)}
        >
          {content}
        </InfoWindow>
      )}
    </>
  );
};
