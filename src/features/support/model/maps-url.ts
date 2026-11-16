/** Builds a Google Maps search/directions link for a showroom address (no embedded map: CSP frame-src stays closed). */
export function buildMapsDirectionsUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.trim())}`;
}
