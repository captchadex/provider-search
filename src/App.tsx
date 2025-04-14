import { Fragment, useEffect, useState } from "react";

import { Coordinates, Provider, SelectableItem } from "./types";

import { Fab } from "./components/ui/fab";
import { Separator } from "./components/ui/separator";
import { ProviderCard } from "./components/ProviderCard";
import { ProviderCardSkeleton } from "./components/ProviderCardSkeleton";
import { FilterBar } from "./components/FilterBar";
import { Map } from "./components/Map";
import { filterProviders } from "./lib/utils";
import { getDistance } from "geolib";

function App() {
  const [isMapVisible, setIsMapVisible] = useState(false);

  const [providers, setProviders] = useState<Provider[]>([]);
  const [currentLocation, setCurrentLocation] = useState<Coordinates>({
    latitude: 37.7749,
    longitude: -122.4194,
  }); // Current viewed location the map, defaults to San Francisco
  const [geolocation, setGeolocation] = useState<Coordinates>({
    latitude: 37.7749,
    longitude: -122.4194,
  }); // Current location of the user

  const [locationSearch, setLocationSearch] = useState<string[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] =
    useState<SelectableItem>(null);
  const [selectedInsurance, setSelectedInsurance] =
    useState<SelectableItem>(null);
  const [asap, setAsap] = useState<boolean>(false);

  const getUserLocation = () => {
    // check if geolocation is supported by the users browser
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ latitude, longitude });
          setGeolocation({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    const fetchProviders = async () => {
      const response = await fetch("http://localhost:3000/providers");
      const data = await response.json();
      setProviders(data);
    };

    fetchProviders();
    getUserLocation();
  }, []);

  return (
    <>
      <h1 className="p-4 scroll-m-20 text-4xl font-extrabold">
        Provider Search
      </h1>
      <div className="pl-4 pr-4">
        <FilterBar
          setLocationSearch={setLocationSearch}
          zipCodes={providers.map((provider) => provider.location.zipCode)}
          selectedSpecialty={selectedSpecialty}
          setSelectedSpecialty={setSelectedSpecialty}
          selectedInsurance={selectedInsurance}
          setSelectedInsurance={setSelectedInsurance}
          asap={asap}
          setAsap={setAsap}
          setCurrentLocation={setCurrentLocation}
        />
      </div>
      {/* Only show provider cards or its loading state if the map is not visible */}
      {!isMapVisible && providers.length === 0 && (
        <>
          <ProviderCardSkeleton />
          <ProviderCardSkeleton />
          <ProviderCardSkeleton />
        </>
      )}
      {!isMapVisible &&
        providers.length > 0 &&
        providers
          .filter(
            filterProviders(
              locationSearch,
              selectedSpecialty,
              selectedInsurance
            )
          )
          // Sort by distance, closest first
          .sort((a, b) => {
            return (
              getDistance(geolocation, {
                latitude: a.location.coordinates.lat,
                longitude: a.location.coordinates.lng,
              }) -
              getDistance(geolocation, {
                latitude: b.location.coordinates.lat,
                longitude: b.location.coordinates.lng,
              })
            );
          })
          // Sort by days to appointment if "asap" is selected
          .sort((a, b) => {
            if (asap) {
              return (
                a.availability.daysToAppointment -
                b.availability.daysToAppointment
              );
            }

            return 0;
          })
          .map((provider, index) => (
            <Fragment key={provider.id}>
              <ProviderCard provider={provider} geolocation={geolocation} />
              {
                // don't show separator after last provider
                index !== providers.length - 1 && <Separator />
              }
            </Fragment>
          ))}
      <Map
        isMapVisible={isMapVisible}
        currentLocation={currentLocation}
        setCurrentLocation={setCurrentLocation}
        geolocation={geolocation}
        providers={providers.filter(
          filterProviders(locationSearch, selectedSpecialty, selectedInsurance)
        )}
      />
      <Fab
        size="lg"
        onClick={() => {
          setIsMapVisible(!isMapVisible);
        }}
      >
        {isMapVisible ? "Hide map" : "Show map"}
      </Fab>
    </>
  );
}

export default App;
