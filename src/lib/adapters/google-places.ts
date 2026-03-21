import { DataSourceAdapter, AdapterInput, AdapterResult } from './types';

interface GooglePlacesData {
  place_id: string;
  display_name: string | null;
  formatted_address: string | null;
  rating: number | null;
  review_count: number | null;
  phone: string | null;
  website: string | null;
  google_maps_url: string | null;
}

const PLACES_BASE = 'https://places.googleapis.com/v1';

// FieldMask for Place Details — Pro tier (controls billing)
// NEVER add reviews, photos, or atmosphere fields
const DETAILS_FIELD_MASK = [
  'displayName',
  'rating',
  'userRatingCount',
  'formattedAddress',
  'nationalPhoneNumber',
  'websiteUri',
  'googleMapsUri',
].join(',');

function getApiKey(): string {
  return process.env.GOOGLE_PLACES_API_KEY || '';
}

async function textSearch(query: string): Promise<string | null> {
  const res = await fetch(`${PLACES_BASE}/places:searchText`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': getApiKey(),
      'X-Goog-FieldMask': 'places.id,places.displayName',
    },
    body: JSON.stringify({ textQuery: query }),
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) return null;

  const data = (await res.json()) as { places?: Array<{ id?: string }> };
  if (data.places && data.places.length > 0) {
    return data.places[0].id ?? null;
  }
  return null;
}

async function getPlaceDetails(placeId: string): Promise<Record<string, unknown> | null> {
  const res = await fetch(`${PLACES_BASE}/places/${placeId}`, {
    headers: {
      'X-Goog-Api-Key': getApiKey(),
      'X-Goog-FieldMask': DETAILS_FIELD_MASK,
    },
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) return null;
  return (await res.json()) as Record<string, unknown>;
}

export const googlePlacesAdapter: DataSourceAdapter<GooglePlacesData> = {
  source: 'google_places',
  cacheTtlSeconds: 86400, // 24 hours

  getCacheKey(input: AdapterInput): string | null {
    // Cache by normalized query so repeat lookups for same business+location hit cache
    const query = `${input.business_name}|${input.location}`.toLowerCase().trim();
    return `gp:q:${query}`;
  },

  getResultCacheKey(data: GooglePlacesData): string | null {
    if (data.place_id) return `gp:${data.place_id}`;
    return null;
  },

  async fetch(input: AdapterInput): Promise<AdapterResult<GooglePlacesData>> {
    try {
      const query = `${input.business_name} ${input.location}`;
      const placeId = await textSearch(query);

      if (!placeId) {
        return { success: false, data: null, source: 'google_places', cached: false, error: 'No matching place found' };
      }

      const details = await getPlaceDetails(placeId);

      if (!details) {
        return { success: false, data: null, source: 'google_places', cached: false, error: 'Failed to fetch place details' };
      }

      const displayName = details.displayName as { text?: string } | undefined;

      const data: GooglePlacesData = {
        place_id: placeId,
        display_name: displayName?.text || null,
        formatted_address: (details.formattedAddress as string) || null,
        rating: (details.rating as number) ?? null,
        review_count: (details.userRatingCount as number) ?? null,
        phone: (details.nationalPhoneNumber as string) || null,
        website: (details.websiteUri as string) || null,
        google_maps_url: (details.googleMapsUri as string) || null,
      };

      return { success: true, data, source: 'google_places', cached: false };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return { success: false, data: null, source: 'google_places', cached: false, error: message };
    }
  },
};
