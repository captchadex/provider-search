import { Fragment, useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

import { Coordinates, Provider, SelectableItem } from "./types";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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

  const filteredProviders = providers
    .filter(
      filterProviders(locationSearch, selectedSpecialty, selectedInsurance)
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
          a.availability.daysToAppointment - b.availability.daysToAppointment
        );
      }

      return 0;
    });

  return (
    <div>
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
      {
        // Show provider cards if there are providers that meet the filters
        !isMapVisible &&
          filteredProviders.length > 0 &&
          filteredProviders.map((provider, index) => {
            return (
              <Fragment key={provider.id}>
                <ProviderCard provider={provider} geolocation={geolocation} />
                {
                  // don't show separator after last provider
                  index !== providers.length - 1 && <Separator />
                }
              </Fragment>
            );
          })
      }
      {
        // Show empty state if no providers meet the filters and the data is no longer loading
        !isMapVisible &&
          providers.length !== 0 &&
          filteredProviders.length === 0 && (
            <Alert className="w-full md:w-[450px] mx-auto my-5">
              <MagnifyingGlassIcon className="h-4 w-4" />
              <AlertTitle>No providers found.</AlertTitle>
              <AlertDescription>
                Adjust your filters to find providers that meet your needs.
              </AlertDescription>
            </Alert>
          )
      }
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
    </div>
  );
}

export default App;
