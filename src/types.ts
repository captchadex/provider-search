export interface Location {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Availability {
  nextAvailable: string; // ISO 8601 date string
  daysToAppointment: number;
}

export interface Provider {
  id: number;
  name: string;
  photo: string;
  specialty: string;
  credentials: string;
  location: Location;
  insuranceAccepted: string[];
  availability: Availability;
  rating: number;
  reviewCount: number;
  languages: string[];
  education: string;
  hospitalAffiliations: string[];
  acceptingNewPatients: boolean;
  telehealth: boolean;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export type SelectableItem = {
  value: string;
  label: string;
} | null;
