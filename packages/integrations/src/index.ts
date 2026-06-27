interface SearchTextParams {
  textQuery: string;
  minRating?: number;
  maxResultCount?: number;
  includedType?: string;
  regionCode?: string;
  rankPreference?: 'RELEVANCE' | 'DISTANCE';
  openNow?: boolean;
}

interface RawPlace {
  id?: string;
  displayName?: { text?: string };
  primaryTypeDisplayName?: { text?: string };
  primaryType?: string;
  formattedAddress?: string;
  addressComponents?: Array<{ longText?: string; types?: string[] }>;
  rating?: number;
  userRatingCount?: number;
  websiteUri?: string;
  nationalPhoneNumber?: string;
  googleMapsUri?: string;
  businessStatus?: string;
}

interface NormalizedPlace {
  placeId: string;
  name: string;
  primaryType: string;
  formattedAddress: string;
  city: string;
  rating?: number;
  reviewCount?: number;
  website?: string;
  phone?: string;
  googleMapsUrl?: string;
  businessStatus?: string;
}

export class GooglePlacesClient {
  private apiKey: string;
  private baseUrl = 'https://places.googleapis.com/v1/places:searchText';

  private constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  static create(): GooglePlacesClient {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) throw new Error('GOOGLE_PLACES_API_KEY environment variable is not set');
    return new GooglePlacesClient(apiKey);
  }

  async searchText(params: SearchTextParams): Promise<{ places: RawPlace[] }> {
    const body: Record<string, unknown> = {
      textQuery: params.textQuery,
      maxResultCount: params.maxResultCount ?? 10,
      rankPreference: params.rankPreference ?? 'RELEVANCE'
    };

    if (params.minRating !== undefined) body.minRating = params.minRating;
    if (params.includedType) body.includedType = params.includedType;
    if (params.regionCode) body.regionCode = params.regionCode;
    if (params.openNow !== undefined) body.openNow = params.openNow;

    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': this.apiKey,
        'X-Goog-FieldMask':
          'places.id,places.displayName,places.primaryType,places.primaryTypeDisplayName,places.formattedAddress,places.addressComponents,places.rating,places.userRatingCount,places.websiteUri,places.nationalPhoneNumber,places.googleMapsUri,places.businessStatus'
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Google Places API error ${res.status}: ${err}`);
    }

    return res.json() as Promise<{ places: RawPlace[] }>;
  }

  normalizePlaces(places: RawPlace[]): NormalizedPlace[] {
    return places.map((p) => {
      const city =
        p.addressComponents?.find((c) => c.types?.includes('locality'))?.longText ??
        p.addressComponents?.find((c) => c.types?.includes('administrative_area_level_1'))
          ?.longText ??
        '';

      return {
        placeId: p.id ?? '',
        name: p.displayName?.text ?? '',
        primaryType: p.primaryTypeDisplayName?.text ?? p.primaryType ?? '',
        formattedAddress: p.formattedAddress ?? '',
        city,
        rating: p.rating,
        reviewCount: p.userRatingCount,
        website: p.websiteUri,
        phone: p.nationalPhoneNumber,
        googleMapsUrl: p.googleMapsUri,
        businessStatus: p.businessStatus
      };
    });
  }
}
