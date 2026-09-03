export interface Location {
  id: string;
  name: string;
  region: string;
  countryCode: string;
  postalCode: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export function validateLocation(location: Partial<Location>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!location.name || location.name.trim().length === 0) {
    errors.push('Location name is required');
  }

  if (!location.region || location.region.trim().length === 0) {
    errors.push('Region is required');
  }

  if (!location.countryCode || location.countryCode.trim().length !== 2) {
    errors.push('Country code must be ISO 2-letter format');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function formatLocationAddress(location: Location): string {
  return `${location.name}, ${location.region} (${location.countryCode.toUpperCase()})`;
}
